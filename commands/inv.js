const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Regarder votre inventaire.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
