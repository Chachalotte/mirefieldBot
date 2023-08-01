const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Commande liés aux personnages du RP')
		.addIntegerOption((option) =>
			option
				.setName('total')
				.setDescription('Valeur totale du jet de dé')
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName('bonus_malus')
				.setDescription('Bonus ou malus ajouté au jet de dé'),
		)
		.addIntegerOption((option) =>
			option
				.setName('multiplicateur')
				.setDescription('Multiplicateur à ajouter au bonus du jet de dé (en pourcent !)')
				.setMinValue(0)
				.setMaxValue(200),
		),

	async execute(interaction) {
		const roll = interaction.options.getInteger('total') || null;
		const bonus = interaction.options.getInteger('bonus_malus') || null;
		const multiplicateur =
			interaction.options.getInteger('multiplicateur') || null;

		const rand = Math.floor(Math.random() * roll);

		if (bonus === null && multiplicateur === null) {
			const result = rand;
			await interaction.reply(
				`**Lancer de dé sur ${roll} :** \n ` + result.toString(),
			);
		}
		else if (multiplicateur === null && bonus !== null) {
			const result = rand + bonus;
			await interaction.reply(
				`**Lancer de dé sur ${roll} :** \n ` +
					result.toString() +
					` (${rand} + ${bonus})`,
			);
		}
		else {
			let result = rand + ((bonus * multiplicateur) / 100);
			result = Math.round(result);
			await interaction.reply(
				`**Lancer de dé sur ${roll} :** \n ` +
					result.toString() +
					` (${rand} + ${bonus}, multiplicateur de ${multiplicateur}%)`,
			);
		}
	},
};
