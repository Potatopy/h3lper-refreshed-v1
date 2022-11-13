const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current track'),
    async execute (client, interaction, args) {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.reply({
                content: `There is no music in the queue`
            })
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You need to be in a vc to run this command' })

        await queue.skip();

        interaction.reply({ content: "Skipped the song ⏩" })
    }
}