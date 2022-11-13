const { QueryType } = require('discord-player')
const {
    SlashCommandBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(option =>
            option
                .setName('songtitle')
                .setDescription('Name of the song you want to search')
                .setRequired(true)
        ),
        async execute(client, interaction) {
            const songTitle = interaction.options.getString('songtitle')

            if (!interaction.member.voice.channel) return interaction.reply({ content: 'You need to be in a vc to run this command' })

            const searchResult = await client.player.search(songTitle, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            const queue = await client.player.createQueue(interaction.guild, {
                metadata: interaction.channel
            })

            if (!queue.connection)
                await queue.connect(interaction.member.voice.channel)

            interaction.reply({ content: `Playing ${songTitle}` })

            searchResult.playlist
                ? queue.addTracks(searchResult.tracks)
                : queue.addTrack(searchResult.tracks[0])

            if (!queue.playing) await queue.play();
        }
}