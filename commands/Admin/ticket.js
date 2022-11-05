const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')
const { openticket } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create a ticket panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const {guild} = interaction;

        const embed = new EmbedBuilder()
            .setDescription("Open a ticket!")

        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('member').setLabel('Report member').setStyle(ButtonStyle.Danger).setEmoji('⚠️'),
            new ButtonBuilder().setCustomId('partnerships').setLabel('Partnerships').setStyle(ButtonStyle.Secondary).setEmoji('🤝'),
            new ButtonBuilder().setCustomId('bot').setLabel('Bot Support').setStyle(ButtonStyle.Primary).setEmoji('🤖'),
            new ButtonBuilder().setCustomId('other').setLabel('Other Support!').setStyle(ButtonStyle.Success).setEmoji('🎫'),
        );

        await guild.channels.cache.get(openticket).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });

        interaction.reply({content: "Ticket panel has been set", ephemeral: true})
    }
}