const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Mettre en pause la musique'),
	async execute(interaction) {
		await interaction.deferReply();
		const client = interaction.client;

		const queue = client.player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return void interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}
		const paused = queue.setPaused(true);
		return void interaction.followUp({
			content: paused ? '⏸ | Paused!' : '❌ | Something went wrong!',
		});
	},
};
