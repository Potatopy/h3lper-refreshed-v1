const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bal-leaderboard')
        .setDescription('Check the leaderboard of the richest users!'),
    async execute(interaction) {
        const { guild } = interaction;
        
        await interaction.deferReply();

        const users = await bankSchema.find().then(users => {
            return users.filter(async user => await guild.members.fetch(user.id))
        })

        const sortedUsers = users.sort((a, b) => {
            return (b.wallet + b.bank) - (a.wallet + a.bank)
        }).slice(0, 10)

        return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `🏆 | ${guild.name}'s Overall Balance Leaderboard` })
                    .setColor("Green")
                    .setDescription(sortedUsers.map((user, index) => {
                        return `**\`[ ${index + 1} ]\`** : **<@${user.id}>** : \`${user.wallet + user.bank} 💰\``
                    }).join("\n"))
            ]
        })
    }
}