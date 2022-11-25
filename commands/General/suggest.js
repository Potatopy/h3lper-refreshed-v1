const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    ButtonStyle
} = require('discord.js');
const suggestionSchema = require('../../Models/suggestion.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest something to the server!')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('Select an option')
            .setRequired(true)
            .addChoices(
                { name: "" }
            )
        )
}