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
        .setName('withdraw')
        .setDescription('Withdraw Funds from your bank.')
        .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('How much you want to deposit')
            .setRequired(true)
    ),

    async execute(interaction, client) {
        const { guild, member } = interaction;
        let balance = eco.balance.fetch(member.id, guild.id)
        let bank = eco.bank.fetch(member.id, guild.id)
        let amount = interaction.options.getNumber('amount')

        if (amount > bank) return interaction.reply(
            {
                content: `Why are you withdrawing money you don't have you brokie :clown:`
            }
        )

        eco.balance.add(amount, member.id, guild.id)
        eco.bank.subtract(amount, member.id, guild.id)

        embed
            .setTitle('Withdraw || Bank to Wallet ||')
            .setDescription(`Successfully Withdrew $${amount} in your bank`)
            .setColor('Green')

        interaction.reply({ embeds: [embed] })
    }
}