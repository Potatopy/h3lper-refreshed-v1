const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Check / change the volume of the song')
        .addIntegerOption(option =>
            option
                .setName('percentage')
                .setDescription('How low or high you want it to go')
                .setRequired(false)
        ),
        async execute(interaction, client) {
            const volumePercentage = interaction.options.getInteger('percentage')
            const queue = client.player.getQueue(interaction.guildId)
            if (!queue?.playing) return interaction.reply({ content: 'There is nothing in the queue' })

            if (!volumePercentage) return interaction.reply({ content: `Current volume is \`${queue.volume}%\`` })

            if (volumePercentage < 0 || volumePercentage > 100)
                return interaction.reply({
                    content: 'Volume must be between 1 to 100'
                });

            queue.setVolume(volumePercentage)

            return interaction.reply({
                content: `Volume has been set to \`${volumePercentage}%\``
            })
        }
}