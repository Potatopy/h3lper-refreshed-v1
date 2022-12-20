const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns "Pong!"'),
    execute(interaction) {
        interaction.reply({content: "Pong!", ephemeral: true}) // only visible to you
    }
}