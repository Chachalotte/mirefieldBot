// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
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
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
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
		client.on(event.name, (...args) => event.execute(...args));
	}
}
client.player = new Player(client);
// Login to Discord with your client's token
client.login(token);

module.exports = { client };
