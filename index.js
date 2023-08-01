// Require the necessary discord.js classes
const {
	Client,
	GatewayIntentBits,
	Collection,
	Events,
	EmbedBuilder,
} = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));
// Require Sequelize
const User = require('./models/user');
const Inventory = require('./models/inventory');
const Comp = require('./models/comp');
const Perso = require('./models/perso');

const db = require('./database/database');
const { Player } = require('discord-player');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	// console.log(`Logged in as ${client.user.tag}!`);
	db.authenticate()
		.then(() => {
			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			// const tag = await Tags.findOne({ where: { name: tagName } });
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			// tag.increment('usage_count');
			User.sync();
			Comp.sync();
			Inventory.sync();
			Perso.sync();

			console.log(`Logged in as ${client.user.tag}!`);
		})
		.catch((err) => console.log(err));
	const player = new Player(client);
	client.player = player;
	exports.client = client;
	exports.player = player;
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
		);
	}
}

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => {
			event.execute(...args);
		});
	}
}

client.on('messageCreate', async (message) => {
	if (message.content.endsWith('vi') || message.content.endsWith('Vi')) {
		var vi = new EmbedBuilder()
			.setColor(0x000000)
			.setImage('https://media.tenor.com/BVJezx-7hNwAAAAS/wink-vi.gif');
		// await message.reply('feur', { embeds: [ballembed] });
		await message.reply({ embeds: [vi] });
	}
	if (message.content.includes('partie 3') || message.content.includes('part 3') || message.content.includes('part III') || message.content.includes('chapitre 3')) {
		var partThree = new EmbedBuilder()
			.setColor(0x000000)
			.setImage('https://i.pinimg.com/564x/84/a5/35/84a535d1950097cfa65524fee5af2021.jpg');
		// await message.reply('feur', { embeds: [ballembed] });
		await message.reply({ embeds: [partThree] });
	}
});
// client.on('messageCreate', (message) => {
// 	console.log(message);
// 	// DON
// 	if (message.author.id === '212990105923616769') {
// 		message.react('🚬');
// 	}
// 	// if (message..id === '212990105923616769') {
// 	// 	message.react('🚬');
// 	// }
// 	// POM
// 	// if (message.author.id === '107245766585626624') {
// 	// 	message.react('🍏');
// 	// }
// 	// if (message.author.id === '396348510162780161') {
// 	// 	message.react('🐔');
// 	// }
// 	// if (message.author.id === '242440632885313536') {
// 	// 	message.react('🚬');
// 	// }
// });
// let's say somebody sent the message `hello`

// Login to Discord with your client's token
client.login(token);

module.exports = { client };
