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
        .setName('bank-top')
        .setDescription('View the Top banks!'),

    async execute(interaction, client) {
        const { guild, member } = interaction;
        let lb = eco.bank.leaderboard(guild.id);
        if (!lb.length) {
            return interaction.reply(
                {
                    content: `No one has coins in their bank! Don't get greedy now.`
                }
            )
        }

        let leaderboard = await lb.map((value, index) => {
            return `\`${index + 1}\`<@${value.userID}>'s Bank: **$${value.money}**`
        })

        embed
        .setColor('Random')
        .setTitle('Bank Leaderboard')
        .setDescription(leaderboard.join('\n'))
        
        interaction.reply({ embeds: [embed] })
    }
}