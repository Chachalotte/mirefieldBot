const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionsBitField,
} = require('discord.js');
const Perso = require('../models/perso');
const Pagination = require('customizable-discordjs-pagination');
const { ButtonStyle } = require('discord.js'); // Discord.js v14+

module.exports = {
	data: new SlashCommandBuilder()
		.setName('perso')
		.setDescription('Commande liés aux personnages du RP')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('mespersos')
				.setDescription('Afficher votre PJ et/ou votre PNJ.'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('recherche')
				.setDescription('Afficher le personnage selon son nom.')
				.addStringOption((option) =>
					option
						.setName('nom')
						.setDescription('Nom de famille du personnage')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('modification')
				.setDescription('Modifier un personnage qui vous appartient.')
				.addStringOption((option) =>
					option
						.setName('nom')
						.setDescription('Nom de famille du personnage.')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option.setName('prenom').setDescription('Prénom du personnage.'),
				)
				.addStringOption((option) =>
					option
						.setName('description')
						.setDescription('Description du personnage.'),
				)
				.addStringOption((option) =>
					option
						.setName('avatar')
						.setDescription('URL de l\'avatar du personnage.'),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('ajout')
				.setDescription('Ajouter un personnage.')
				.addStringOption((option) =>
					option
						.setName('nom')
						.setDescription('Nom de famille du personnage.')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('prenom')
						.setDescription('Prénom du personnage.')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('description')
						.setDescription('Description du personnage.')
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName('avatar')
						.setDescription('URL de l\'avatar du personnage.')
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
		const userName = interaction.options.getString('nom') || null;
		const prenom = interaction.options.getString('prenom') || null;
		const description = interaction.options.getString('description') || null;
		const avatar = interaction.options.getString('avatar') || null;

		var messagePerso = new EmbedBuilder().setColor(0x0099ff).setTimestamp();
		const allMessage = [];
		let firstLoop = 0;
		if (interaction.options.getSubcommand() === 'mespersos') {
			const personnage = await Perso.findOne({ where: { nom: userName } });
			messagePerso.setImage(personnage.avatar);
			messagePerso.addFields(
				{
					name: personnage.prenom + ' ' + personnage.nom,
					value: personnage.description,
					inline: false,
				},
				{
					name: 'TERRIUM',
					value: personnage.money.toString(),
					inline: true,
				},
			);
			messagePerso.addFields({
				name: 'Compétence personnalisée : ' + personnage.compPerso,
				value: 'Eh non, pas encore !',
				inline: false,
			});
		}

		if (interaction.options.getSubcommand() === 'ajout') {
			if (
				interaction.member.permissions.has([
					PermissionsBitField.Flags.KickMembers,
					PermissionsBitField.Flags.BanMembers,
				])
			) {
				console.log('This member can kick and ban');
				const perso = await Perso.create({
					nom: userName,
					prenom: prenom,
					description: description,
					avatar: avatar,
					compPerso: 'empty',
				});
				messagePerso.setImage(perso.avatar);
				messagePerso.addFields({
					name: perso.prenom + ' ' + perso.nom + ' ajouté !',
					value: ' ',
				});
			}
			else {
				messagePerso.addFields({
					name: 'Vous n\'avez pas les permissions !',
					value: ' ',
				});
			}
		}

		// else if (interaction.options.getSubcommand() === 'ajout' && ){

		// }

		if (interaction.options.getSubcommand() === 'recherche') {
			// const userName = interaction.options.getString('nom') || null;

			const personnage = await Perso.findOne({ where: { nom: userName } });
			messagePerso.setImage(personnage.avatar);
			messagePerso.addFields(
				{
					name: personnage.prenom + ' ' + personnage.nom,
					value: personnage.description,
					inline: false,
				},
				{
					name: 'TERRIUM',
					value: personnage.money.toString(),
					inline: true,
				},
				{
					name: 'Inventaire',
					value: '???',
					inline: true,
				},
			);
			messagePerso.addFields({
				name: 'Compétence personnalisée : ' + personnage.compPerso,
				value: 'Eh non, pas encore !',
				inline: false,
			});
		}
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
