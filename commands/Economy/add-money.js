const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    PermissionFlagsBits,
    WebhookClient
} = require('discord.js')

const eco = require('../../data/EcoDB')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-money')
        .setDescription('Add money to the specified user')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User you want to add money to')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('How much you want to add?')
                .setRequired(true)
        ),
        async execute(interaction, client) {
            const { guild, member } = interaction;
            const embed = new EmbedBuilder()
            const target = interaction.options.getUser('target') || member;
            const amount = interaction.options.getNumberOption('amount') || 1;
            eco.balance.add(amount, target.id, guild.id)

            embed
                .setTitle('Coins Successfully added!')
                .setDescription(`Successfully added $${amount} coins to ${target} balance!`)
                .setColor('Random')
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        }
}