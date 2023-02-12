const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Commande liés aux personnages du RP')
		.addIntegerOption((option) =>
			option
				.setName('total')
				.setDescription('Valeur totale du roll')
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName('bonus').setDescription('Bonus ajouté au roll'),
		),
	async execute(interaction) {
		const roll = interaction.options.getInteger('total') || null;
		const bonus = interaction.options.getInteger('bonus') || null;

		const rand = Math.floor(Math.random() * roll);

		if (bonus === null) {
			const result = rand;
			await interaction.reply(
				`**Lancer de dé sur ${roll} :** \n ` + result.toString(),
			);
		}
		else {
			const result = rand + bonus;

			await interaction.reply(
				`**Lancer de dé sur ${roll} :** \n ` +
					result.toString() +
					` (${rand} + ${bonus})`,
			);
		}
	},
};
