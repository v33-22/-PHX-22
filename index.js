require("dotenv").config();
const fs = require("fs");
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// =======================
// BASIC SETUP
// =======================
client.commands = new Collection();
const prefix = "!";

// =======================
// LOAD COMMANDS
// =======================
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// =======================
// LOAD EVENTS
// =======================
const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// =======================
// MESSAGE HANDLER (PREFIX COMMANDS)
// =======================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // Mention response (Aphrodite personality base)
    if (message.mentions.has(client.user)) {
        return message.reply("I'm here… Aphrodite is listening 💗");
    }

    if (!content.startsWith(prefix)) return;

    const args = content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(client, message, args);
    } catch (err) {
        console.error(err);
        message.reply("Something went wrong using that command.");
    }
});

// =======================
// READY EVENT (fallback if no event file yet)
// =======================
client.once("ready", () => {
    console.log(`💗 Aphrodite is online as ${client.user.tag}`);
});

// =======================
// LOGIN
// =======================
client.login(process.env.TOKEN);
