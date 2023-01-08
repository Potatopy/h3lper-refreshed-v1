const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns "Pong!"'),
    execute(interaction) {
        interaction.reply({content: `Pong! 🏓: ${client.ws.ping}`, ephemeral: true}) // only visible to you
    }
}