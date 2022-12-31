// Credits: Kaj on Youtube (he is an underrated mf) + zach.#7777

const { Client, GatewayIntentBits, Partials, GuildScheduledEvent, Guild, Collection } = require('discord.js')
const logs = require('discord-logs')
const {forEach} = require('fs')

const {handleLogs} = require('./handlers/handleLogs')
const {loadEvents} = require('./handlers/eventHandler')
const {loadCommands} = require('./handlers/commandHandler')

const client = new Client({
    shards: "auto",
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)]
});

logs(client, {
    debug: true
})

client.commands = new Collection()
client.config = require('./configs/config.json')

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    nsfw: true,
    emitAddSongWhenCreatingQueue: true,
    emptyCooldown: 300,
    plugins: [new SpotifyPlugin()]
});

client.giveawaysConfig = require('./configs/config.js')

const handlers = ['giveawaysEventsHandler', 'giveawaysManager']
handlers.forEach((x) => {
    require(`./utils/${x}`)(client);
})

module.exports = client;

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
    handleLogs(client);
})