const {EmbedBuilder} = require('discord.js');
const Levels = require('discord.js-leveling');

module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (!message.guild || message.author.bot) return;
        
        if (message.content.length < 3) return // If there is less than 3 characters in the message, no xp will be rewarded.

        const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

        if (hasLeveledUp) {
            const user = await Levels.fetch(message.author.id, message.guild.id);
            message.channel.send(`GG! ${message.author} has leveled up to ${user.level}!`);
        }
    }
}