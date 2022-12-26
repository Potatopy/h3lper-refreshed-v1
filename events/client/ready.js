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
        } else if (mongoose.error) {
            console.log('Oops! An error occured!')
        } else if (mongoose.connectionError) {
            console.log('Oops! A connection error occured!')
        } else if (mongoose.timeout) {
            console.log('Oops! The database timed out!')
        } else {
            console.log('Oops! An unknown error occured!, Maybe MongoDB is down?')
        }

        Levels.setURL(config.mongodb);

        client.once('ready', () => {
            console.log(`Logged in as ${client.user.tag}`)
        })
    }
}