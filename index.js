// Credits: Kaj on Youtube (he is an underrated mf) + zach.#0001

const { Client, GatewayIntentBits, Partials, GuildScheduledEvent, Guild, Collection } = require('discord.js')
const logs = require('discord-logs')

const {handleLogs} = require('./handlers/handleLogs')
const {loadEvents} = require('./handlers/eventHandler')
const {loadCommands} = require('./handlers/commandHandler')

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)]
});

logs(client, {
    debug: true
})

client.commands = new Collection()
client.config = require('./config.json')

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
    handleLogs(client);
})