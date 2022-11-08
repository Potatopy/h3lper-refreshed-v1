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
        .setName('add-item')
        .setDescription('Add an item to your shop!')
        .addStringOption((option) =>
        option
            .setName('item-name')
            .setDescription('Name of your item')
            .setRequired(true)
    )
    .addNumberOption((option) =>
    option
        .setName('price')
        .setDescription('Set the price for this item!')
        .setRequired(true)
    )
    .addStringOption((option) =>
    option
        .setName('message')
        .setDescription('What to say when the user ueses the item')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('Describe your item!')
            .setRequired(true)
    )
    .addNumberOption((option) =>
    option
        .setName('amount')
        .setDescription('What is the max a user can have (If its 0 leave blank)')
        .setRequired(false)
    )
    .addRoleOption((option) =>
    option
        .setName('role')
        .setDescription('What role you want to give when the user recieves this item.') // This is to track how many are in the system without looking at the .json file or your mongo database
        .setRequired(true)
    )
}