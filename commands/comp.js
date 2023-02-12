const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Comp = require('../models/comp');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('comp')
		.setDescription('Afficher la liste des compétences personnalisées')
		.addStringOption((option) =>
			option.setName('nom').setDescription('Nom de la compétence'),
		),
	async execute(interaction) {
		const messageComp = new EmbedBuilder()
			.setColor(0x0099ff)
			.setThumbnail('https://i.imgur.com/AfFp7pu.png')
			.setTimestamp();
		const compName = interaction.options.getString('nom') || null;

		if (compName != null) {
			const comp = await Comp.findOne({ where: { name: compName } });
			messageComp.addFields({
				name: comp.name,
				value: comp.description,
				inline: true,
			});
		}
		else {
			const comps = await Comp.findAll();
			comps.forEach((comp, i) => {
				messageComp.addFields({
					name: comp.name,
					value: comp.name,
				});
			});
		}
		// const pseudo = interaction.options.getString('pseudo');

		try {
			return interaction.reply({ embeds: [messageComp] });
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('Cet utilisateur existe déjà !');
			}
			else {
				console.log(error);
				return interaction.reply('Erreur inconnue, désolé, c\'est bête hein ?');
			}
		}
	},
};
