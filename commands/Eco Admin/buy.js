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
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption((option) =>
        option
            .setName('item')
            .setDescription('The item you want to buy')
            .setRequired(true)
    )
}