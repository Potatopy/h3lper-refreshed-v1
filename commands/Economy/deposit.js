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
        .setName('deposit')
        .setDescription('Deposit Funds in your bank.')
        .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('How much you want to deposit!')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild, member } = interaction;
        let balance = eco.balance.fetch(member.id, guild.id)
        let amount = interaction.options.getNumber('amount')

        if (amount > balance) return interaction.reply(
            {
                content: `Why are you depositing money you don't have you brokie :clown:`
            }
        )

        eco.balance.subtract(amount, member.id, guild.id)
        eco.bank.add(amount, member.id, guild.id)

        embed
            .setTitle('Deposit || Wallet to Bank ||')
            .setDescription(`Successfully deposited $${amount} in your bank`)
            .setColor('Green')

        interaction.reply({ emebds: [embed] })
    }
}