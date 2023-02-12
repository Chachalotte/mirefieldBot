const { SlashCommandBuilder } = require('discord.js');

const citationArray = [
	'« Vous savez, je n\'ai pas fui face à Johnny. J`ai simplement pris les jambes à mon cou ! », Leonardo',
	'« NON JE NE L\'AI PAS EMPECHER DE SAUVER ELEANORE ! », Elias',
	'« Et cerise sur la gâteau, vous feriez bander un mort tellement... », Oliver',
	'« Здравствуйте, мадам », Leonardo',
	' « Je ne bois pas la pisse de ce pays. », Red Herring',
];
module.exports = {
	data: new SlashCommandBuilder()
		.setName('citation')
		.setDescription('Citation random'),
	async execute(interaction) {
		const randomIndex = Math.floor(Math.random() * citationArray.length);
		const randomElement = citationArray[randomIndex];
		await interaction.reply(randomElement);
	},
};
