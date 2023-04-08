const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Mettre en pause la musique'),
	async execute(interaction) {
		if (
			interaction.member.permissions.has([
				PermissionsBitField.Flags.KickMembers,
				PermissionsBitField.Flags.BanMembers,
			])
		) {
			await interaction.deferReply();
			const client = interaction.client;
			const player = client.player;

			const queue = player.getQueue(interaction.guildId);
			if (!queue || !queue.playing) {
				return void interaction.followUp({
					content: '❌ | Pas de musique en cours!',
				});
			}
			const paused = queue.setPaused(true);
			return void interaction.followUp({
				content: paused ? '⏸ | Mis en pause!' : '❌ | Oups ! J\'ai bugué!',
			});
		}
		else {
			return interaction.reply('Vous n\'avez pas les permissionss');
		}
	},
};
