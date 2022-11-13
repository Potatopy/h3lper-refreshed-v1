const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current track!'),

    async execute(interaction, client) {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) return interaction.reply('There is nothing playing')

        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You need to be in a vc to run this command' })

        queue.setPaused(false);

        interaction.reply({ content: "Resumed ▶️" })
        
    }
}