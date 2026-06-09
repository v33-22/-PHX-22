import { Client, GatewayIntentBits } from ‘discord.js’;
import fs from ‘fs’;

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
]
});

function loadAFK() {
return JSON.parse(fs.readFileSync(’./data/afk.json’, ‘utf8’));
}

function saveAFK(data) {
fs.writeFileSync(’./data/afk.json’, JSON.stringify(data, null, 2));
}

client.once(‘ready’, () => {
console.log(‘PHX-22 is online!’);
});

client.on(‘guildMemberAdd’, (member) => {
const channel = member.guild.systemChannel;

if (!channel) return;

channel.send(
Welcome, ${member}! I'm PHX-22. Make yourself comfortable and enjoy your stay.
);
});

client.on(‘messageCreate’, (message) => {
if (message.author.bot) return;

const afkData = loadAFK();
const msg = message.content.toLowerCase();

// Remove AFK status when user talks again
if (afkData[message.author.id]) {
delete afkData[message.author.id];
saveAFK(afkData);

message.reply(
  'Welcome back. I removed your AFK status.'
);

}

// Notify if mentioned user is AFK
for (const user of message.mentions.users.values()) {
if (afkData[user.id]) {
message.reply(
${user.username} is currently AFK: ${afkData[user.id].reason}
);
}
}

// Ping command
if (msg === ‘!ping’) {
return message.reply(‘Pong!’);
}

// AFK command
if (msg.startsWith(’!afk’)) {
const reason =
message.content.slice(5).trim() || ‘Away from keyboard’;

afkData[message.author.id] = {
  reason: reason
};
saveAFK(afkData);
return message.reply(
  `Okay, I've marked you as AFK: ${reason}`
);

}

// Bot mention replies
if (message.mentions.has(client.user)) {
const replies = [
“Hey, what’s up?”,
“I’m here if you need anything.”,
“You called?”,
“How can I help?”,
“What’s on your mind?”,
“I’m listening.”,
“Need something?”
];

const reply =
  replies[Math.floor(Math.random() * replies.length)];
return message.reply(reply);

}

// Name detection
if (
msg.includes(‘phx-22’) ||
msg.includes(‘phx22’)
) {
const replies = [
“Hm?”,
“I’m here.”,
“Did you need something?”,
“You mentioned me?”,
“What’s up?”,
“How can I help?”
];

const reply =
  replies[Math.floor(Math.random() * replies.length)];
return message.reply(reply);

}
});

client.login(process.env.TOKEN);
