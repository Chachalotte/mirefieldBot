const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Perso = require('../models/perso');
const Pagination = require('customizable-discordjs-pagination');
const { ButtonStyle } = require('discord.js'); // Discord.js v14+

module.exports = {
	data: new SlashCommandBuilder()
		.setName('perso')
		.setDescription('Commande liés aux personnages du RP')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('recherche')
				.setDescription('Afficher le personnage selon son nom')
				.addStringOption((option) =>
					option
						.setName('nom')
						.setDescription('Nom du personnage')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('liste')
				.setDescription('Voir la liste des personnages du rp'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('avatar')
				.setDescription('Afficher une image aléatoire parmi les perso du RP'),
		),
	async execute(interaction) {
		const buttons = [
			{ label: 'Previous', emoji: '⬅', style: ButtonStyle.Primary },
			{ label: 'Stop', emoji: '🛑', style: ButtonStyle.Danger },
			{ label: 'Next', emoji: '➡', style: ButtonStyle.Primary },
		];

		var messagePerso = new EmbedBuilder().setColor(0x0099ff).setTimestamp();
		const allMessage = [];
		let firstLoop = 0;
		if (interaction.options.getSubcommand() === 'liste') {
			const personnages = await Perso.findAll();
			personnages.forEach((perso, i) => {
				if (i % 5 === 0 && firstLoop > 0) {
					allMessage.push(messagePerso);
					messagePerso = null;
					messagePerso = new EmbedBuilder().setColor(0x0099ff).setTimestamp();
				}
				else if (i === personnages.length - 1) {
					allMessage.push(messagePerso);
				}
				firstLoop++;
				messagePerso.addFields(
					{
						name: perso.prenom + ' ' + perso.nom,
						value: perso.description,
						inline: true,
					},
					{
						name: 'Compétence personnalisée',
						value: perso.compPerso,
						inline: true,
					},
					{
						name: '\b',
						value: '\b',
						inline: true,
					},
				);
			});
		}

		if (interaction.options.getSubcommand() === 'recherche') {
			const userName = interaction.options.getString('nom') || null;

			const personnage = await Perso.findOne({ where: { nom: userName } });
			messagePerso.setImage(personnage.avatar);
			messagePerso.addFields({
				name: personnage.prenom + ' ' + personnage.nom,
				value: personnage.description,
				inline: false,
			});
			messagePerso.addFields({
				name: 'Compétence personnalisée : ' + personnage.compPerso,
				value: 'Eh non, pas encore !',
				inline: false,
			});
		}

		if (interaction.options.getSubcommand() === 'avatar') {
			const personnages = await Perso.findAll();
			const length = personnages.length;
			const rand = Math.floor(Math.random() * length);

			const avatarPerso = personnages[rand];
			messagePerso.setImage(avatarPerso.avatar);
			messagePerso.addFields({
				name: avatarPerso.prenom + ' ' + avatarPerso.nom,
				value: ' ',
				inline: true,
			});
		}

		try {
			if (allMessage.length > 0) {
				new Pagination()
					.setCommand(interaction)
					.setPages(allMessage)
					.setButtons(buttons)
					.setPaginationCollector({ timeout: 120000 })
					.setSelectMenu({ enable: true })
					.setFooter({ enable: true })
					.send();
			}
			else {
				return interaction.reply({ embeds: [messagePerso] });
			}
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
