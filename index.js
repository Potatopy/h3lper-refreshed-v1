// Credits: Kaj on Youtube (he is an underrated mf) + zach.#7777

const { Client, GatewayIntentBits, Partials, GuildScheduledEvent, Guild, Collection } = require('discord.js')
const logs = require('discord-logs')

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
client.config = require('./config.json')

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
module.exports = client;

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
    handleLogs(client);
})