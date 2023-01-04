const { Client } = require('discord.js');
const { default: mongoose } = require('mongoose');
const config = require("../../configs/config.json")
const Levels = require('discord.js-leveling');
const chalk = require('chalk');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log(chalk.green('MongoDB Connected!'))
        } else if (mongoose.disconnect) {
            console.log(chalk.red('Oops! The database disconnected!'))
        } else if (mongoose.error) {
            console.log(chalk.cyan('Oops! An error occured!'))
        } else if (mongoose.connectionError) {
            console.log(chalk.yellow('Oops! A connection error occured!'))
        } else if (mongoose.timeout) {
            console.log(chalk.magenta('Oops! The database timed out!'))
        } else {
            console.log(chalk.blue('Oops! An unknown error occured!, Maybe MongoDB is down?'))
        }

        Levels.setURL(config.mongodb);

        client.once('ready', () => {
            console.log(chalk.green(`Logged in as ${client.user.tag}`))
        })
    }
}