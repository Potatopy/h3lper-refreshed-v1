const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    WebhookClient
} = require('discord.js')

const eco = require('../../data/EcoDB')
const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bal-top')
        .setDescription('View the top users with money in this server!'),
    
    async execute(interaction, client) {
        const { guild, member } = interaction;
        const lb = eco.balance.leaderboard(guild.id)

        if (!lb.length) {
            return interaction.reply(
                {
                    content: `There are no users with any money. MAKE SOME BREAD!`
                }
            )
        }

        const leaderboard = await lb.map((value, index) => {
            return `\`${index + 1}\`<@${value.userID}>'s Money: **$${value.money}**`
        })

        embed
            .setColor('Random')
            .setTitle('Coins Leaderboard')
            .setDescription(leaderboard.join('\n'))

        interaction.reply({ embeds: [embed] })
    }
}