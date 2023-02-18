const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Voir la liste des commandes !'),
	async execute(interaction) {
		// const buttons = [
		// 	{ label: 'Previous', emoji: '⬅', style: ButtonStyle.Primary },
		// 	{ label: 'Stop', emoji: '🛑', style: ButtonStyle.Danger },
		// 	{ label: 'Next', emoji: '➡', style: ButtonStyle.Primary },
		// ];
		// const allMessage = [];

		var messageAide = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTimestamp()
			.setThumbnail(
				'https://i.pinimg.com/564x/89/1f/72/891f725519c5078cdd2d1feef64a5f94.jpg',
			)
			.setDescription(
				'Bienvenue ! Je serai votre assistant. Pour pouvoir m\'utiliser, il vous suffit de taper une commande à l\'aide de "/nomDeLaCommande". Je vais vous fournir de suite la liste complète des commandes de disponibles ! N\'oubliez pas qu\'il existe aussi des sous-commandes. En tapant le premier mot clé de la commande, vous avez une description qui vous explique chacunes des utilités de la sous-commande en question. ',
			);
		messageAide.addFields(
			{
				name: '\b',
				value: '\b',
				inline: false,
			},
			{
				name: '/Inscription',
				value:
					'Commencer votre histoire. Cela créer un modèle de personnage vide que vous pouvez modifier.',
				inline: false,
			},
			{
				name: '\b',
				value: '\b',
				inline: false,
			},
			{
				name: '/Perso',
				value:
					'Afficher la liste des personnages, votre personnage ainsi que son inventaire avec la possibilité de le modifier, ou rechercher un autre personnage en particulier. Possibilité d\'afficher un personnage aléatoire du RP.',
				inline: false,
			},
			{
				name: '\b',
				value: '\b',
				inline: false,
			},
			{
				name: '/Roll',
				value:
					'Lancer un jet de dé avec une valeur maximale. Possibilité d\'ajouter un malus ou un bonus, ainsi qu\'un multiplicateur à votre jet de dé.',
				inline: false,
			},
			{
				name: '\b',
				value: '\b',
				inline: true,
			},
		);

		return interaction.reply({ embeds: [messageAide] });
	},
};
