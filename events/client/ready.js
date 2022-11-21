const { Client } = require('discord.js');
const { default: mongoose } = require('mongoose');
const config = require("../../config.json")
const Levels = require('discord.js-leveling');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('MongoDB Connected!')
        } else if (mongoose.disconnect) {
            console.log('Oops! The database disconnected!')
        }

        Levels.setURL(config.mongodb);

        client.once('ready', () => {
            console.log(`Logged in as ${client.user.tag}`)
        })
    }
}