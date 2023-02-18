const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventaire')
		.setDescription('Accéder à votre inventaire.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
