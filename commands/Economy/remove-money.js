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
        .setName('remove-money')
        .setDescription('Remove money from a users balance')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User you want to remove money from')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('Amount you want to remove')
                .setRequired(true)
        ),
        async execute(interaction, client) {
            const { guild, member } = interaction;
            const embed = new EmbedBuilder()
            const target = interaction.options.getUser('target') || member;
            const amount = interaction.options.getNumberOption('amount') || 1;
            eco.balance.subtract(amount, target.id, guild.id)

            embed
                .setTitle('Coins removed')
                .setDescription(`Successfully removed $${amount} from ${target}`)
                .setColor('Red')
                .setTimestamp()

            interaction.reply({ embeds: [embed] })
        }
}