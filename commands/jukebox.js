const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jukebox')
		.setDescription('Chercher des musique via youtube / soundcloud ;)')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('song')
				.setDescription('Loads a single song from a url')
				.addStringOption((option) =>
					option
						.setName('url')
						.setDescription('Lien de la musique (Youtube / Soundcloud)')
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
				.setName('search')
				.setDescription('Chercher une musique')
				.addStringOption((option) =>
					option
						.setName('searchterms')
						.setDescription('nom du terme')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'song') {
			const urlLink = interaction.options.getString('url') || null;

			const client = interaction.client;
			const player = new Player(client);
			player.on('trackStart', (queue, track) =>
				queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`),
			);

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
			const queue = player.createQueue(interaction.guild, {
				ytdlOptions: {
					filter: 'audioonly',
					highWaterMark: 1 << 30,
					dlChunkSize: 0,
				},
				metadata: interaction.channel,
			});

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

			await interaction.deferReply();
			const track = await player
				.search(urlLink, {
					requestedBy: interaction.user,
				})
				.then((x) => x.tracks[0]);
			if (!track) {
				return await interaction.followUp({
					content: `❌ | Track **${urlLink}** not found!`,
				});
			}

			queue.play(track);

			return await interaction.followUp({
				content: `⏱️ | Et on va jouer... **${track.title}**!`,
			});
		}
	},
};
