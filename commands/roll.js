const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Effectuer un jet de dé!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};