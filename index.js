// Credits: Kaj on Youtube (he is an underrated mf) + zach.#0001

const { Client, GatewayIntentBits, Partials, GuildScheduledEvent, Guild, Collection } = require('discord.js')
const config = require('./config.json')
const { Player } = require('discord-player')
let xp = require('simply-xp')

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember, Channel } = Partials

const {loadEvents} = require('./handlers/eventHandler')
const {loadCommands} = require('./handlers/commandHandler')

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember]
});

client.commands = new Collection();
xp.connect(config.mongodb, {
    notify: true,
})
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});
client.config = require('./config.json')

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
})