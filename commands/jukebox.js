const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { useMasterPlayer, Track, useQueue } = require('discord-player');

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
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('skip').setDescription('Skip la musique'),
		),
	async execute(interaction) {
		const client = interaction.client;
		// const player = client.player;
		const player = useMasterPlayer();
		player.events.on('connection', (queue) => {
			queue.dispatcher.voiceConnection.on(
				'stateChange',
				(oldState, newState) => {
					const oldNetworking = Reflect.get(oldState, 'networking');
					const newNetworking = Reflect.get(newState, 'networking');

					const networkStateChangeHandler = (
						oldNetworkState,
						newNetworkState,
					) => {
						const newUdp = Reflect.get(newNetworkState, 'udp');
						clearInterval(newUdp?.keepAliveInterval);
					};

					oldNetworking?.off('stateChange', networkStateChangeHandler);
					newNetworking?.on('stateChange', networkStateChangeHandler);
				},
			);
		});
		const queue = await client.player.nodes.create(interaction.guild, {
			metadata: {
				channel: interaction.channel,
				client: interaction.guild.members.me,
				requestedBy: interaction.user,
			},
			selfDeaf: true,
		});
		if (interaction.options.getSubcommand() === 'play') {
			const urlLink = interaction.options.getString('song_name') || null;
			await interaction.deferReply();
			const channel = interaction.member.voice.channel;

			const { track } = await player.play(channel, urlLink, {
				nodeOptions: {
					// nodeOptions are the options for guild node (aka your queue in simple word)
					metadata: interaction, // we can access this metadata object using queue.metadata later on
				},
			});

			// const searchResult = await player.search(urlLink, {
			// 	requestedBy: interaction.user,
			// });

			// queue.insertTrack(searchResult.tracks[0], 0); // Remember queue index starts from 0, not 1
			// queue.node.play();
			if (!interaction.member.voice.channelId) {
				return await interaction.reply({
					content: 'Tu n\'es pas dans un salon vocal!',
					ephemeral: true,
				});
			}
			if (
				interaction.guild.members.me.voice.channelId &&
				interaction.member.voice.channelId !==
					interaction.guild.members.me.voice.channelId
			) {
				return await interaction.reply({
					content: 'Tu n\'es pas dans un salon vocal!',
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
					content: 'Impossible de rejoindre le channel vocal',
					ephemeral: true,
				});
			}

			// queue.node.play();

			return await interaction.followUp({
				content: `⏱️ | Et on va jouer... **${track.title}**!`,
				// content: 'mince',
			});
		}
		if (interaction.options.getSubcommand() === 'queue') {
			return await interaction.reply('ok');
		}
		if (interaction.options.getSubcommand() === 'piste') {
			return await interaction.reply('ok');
		}
		if (interaction.options.getSubcommand() === 'skip') {
			queue.node.skip();

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
