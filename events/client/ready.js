const { Client } = require('discord.js');
const { default: mongoose } = require('mongoose');
const config = require("../../config.json")

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('MongoDB Connected!')
        }


        client.once('ready', () => {
            console.log(`Logged in as ${client.user.tag}`)
        })
    }
}