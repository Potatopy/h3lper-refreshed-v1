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
        .setName('remove-item')
        .setDescription('Remove an item from the shop')
        .addStringOption((option) =>
        option
            .setName('item')
            .setDescription('Item to remove')
            .setRequired(true)
    )
}