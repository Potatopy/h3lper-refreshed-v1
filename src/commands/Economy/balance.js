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
        .setName('balance')
        .setDescription('View the balance of a user or yourself.')
        .addStringOption((option) =>
        option
            .setName('target')
            .setDescription('User you want to view the balance of')
    ),

    async execute(interaction, client) {
        const { guild, member } = interaction;
        let balance = eco.balance.fetch(member.id, guild.id)
        let bank = eco.bank.fetch(member.id, guild.id)

        if (!balance) balance = 0
        if (!bank) bank = 0

        embed
            .setTitle(`**${interaction.member.user.username}**'s Balance`)
            .setDescription(`**${interaction.member.user.username}** Balance + Bank`)
            .addFields(
                {
                    name: 'Current Balance',
                    value: `$${balance}`,
                    inline: true
                },
                {
                    name: 'Current Bank',
                    value: `$${bank}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setColor('Green')

        interaction.reply({ embeds: [embed] })
    }
}