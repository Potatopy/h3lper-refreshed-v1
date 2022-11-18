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
        .setName('set-money')
        .setDescription('Set a specific balance to a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User you want to set the balance to')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('Amount to set')
                .setRequired(true)
        ),
        async execute(interaction, client) {
            const { guild, member } = interaction;
            const embed = new EmbedBuilder()
            const target = interaction.options.getUser('target') || member;
            const amount = interaction.options.getNumberOption('amount') || 1;
            eco.balance.set(amount, target.id, guild.id)

            embed
                .setTitle('Coins Successfully set!')
                .setDescription(`Successfully set $${amount} to ${target}`)
                .setColor('Green')
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        }
}