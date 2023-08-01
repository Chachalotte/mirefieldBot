const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/user');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('inscription')
		.setDescription('S\'inscrire !'),
	async execute(interaction) {
		// const pseudo = interaction.options.getString('pseudo');
		const username = interaction.user.username;
		const userId = interaction.user.id;
		const avatar = interaction.avatar;
		const invId = 1;

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const user = await User.create({
				id: userId,
				pseudo: username,
				inv_id: invId,
				avatar: avatar,
			});

			return interaction.reply(`Bienvenue à Mirefield, ${user.pseudo}.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('Cet utilisateur existe déjà !');
			}
			else {
				console.log(error);
				return interaction.reply('Erreur inconnue, ouin');
			}
		}
	},
};
