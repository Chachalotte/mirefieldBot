const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jukebox')
		.setDescription('Chercher des musique via youtube / soundcloud ;)')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription(
					'Permets de jouer une musique et l\'ajouter à la queue existante.',
				)
				.addStringOption((option) =>
					option
						.setName('song_name')
						.setDescription('Nom de la musique (Youtube / Soundcloud)')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('playlist')
				.setDescription('Loads a playlist of songs from a url')
				.addStringOption((option) =>
					option
						.setName('url')
						.setDescription(
							'Lien de la playlist (c\'est pas encore pris en charge dsl)',
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('queue')
				.setDescription('Afficher la queue de la musique !'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('piste')
				.setDescription('Afficher la musique en train d\'être jouée.'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('refresh')
				.setDescription('Remettre la playlist à zéro'),
		),
	async execute(interaction) {
		const client = interaction.client;
		const player = client.player;
		await interaction.deferReply();

		player.on('connectionCreate', (queue) => {
			queue.connection.voiceConnection.on(
				'stateChange',
				(oldState, newState) => {
					if (
						oldState.status === VoiceConnectionStatus.Ready &&
						newState.status === VoiceConnectionStatus.Connecting
					) {
						queue.connection.voiceConnection.configureNetworking();
					}
				},
			);
		});

		let queue = player.getQueue(interaction.guildId);

		if (interaction.options.getSubcommand() === 'play') {
			const urlLink = interaction.options.getString('song_name') || null;
			if (!queue || !queue.playing) {
				queue = player.createQueue(interaction.guild, {
					ytdlOptions: {
						filter: 'audioonly',
						highWaterMark: 1 << 30,
						dlChunkSize: 0,
						quality: 'highestaudio',
					},
					metadata: interaction.channel,
				});
			}

			const track = await player
				.search(urlLink, {
					requestedBy: interaction.user,
				})
				.then((x) => x.tracks[0]);
			if (!track) {
				return await interaction.followUp({
					content: `❌ | La musique **${urlLink}** n'a pas été trouvée!`,
				});
			}

			if (!interaction.member.voice.channelId) {
				return await interaction.reply({
					content: 'You are not in a voice channel!',
					ephemeral: true,
				});
			}
			if (
				interaction.guild.members.me.voice.channelId &&
				interaction.member.voice.channelId !==
					interaction.guild.members.me.voice.channelId
			) {
				return await interaction.reply({
					content: 'You are not in my voice channel!',
					ephemeral: true,
				});
			}

			// verify vc connection
			try {
				if (!queue.connection) {
					await queue.connect(interaction.member.voice.channel);
				}
			}
			catch {
				queue.destroy();
				return await interaction.reply({
					content: 'Could not join your voice channel!',
					ephemeral: true,
				});
			}

			// const length = queue.length;

			// queue.insert(track, length);

			queue.play(track);

			return await interaction.followUp({
				content: `⏱️ | Et on va jouer... **${track.title}**!`,
			});
		}
		if (interaction.options.getSubcommand() === 'queue') {
			return await interaction.reply('ok');
		}
		if (interaction.options.getSubcommand() === 'piste') {
			return await interaction.reply('ok');
		}
		if (interaction.options.getSubcommand() === 'refresh') {
			const progressBar = queue.createProgressBar();
			return await interaction.followUp({
				content: `La playlist a été vidée. | ${progressBar}`,
			});
		}
	},
};
