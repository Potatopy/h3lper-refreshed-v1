const {
    SlashCommandBuilder
} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current track!'),
    async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) return interaction.reply('There is nothing playing')

        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You need to be in a vc to run this command' })
        
        queue.setPaused(true)

        return interaction.reply({ content: 'Paused ⏸️' })
    }
}

