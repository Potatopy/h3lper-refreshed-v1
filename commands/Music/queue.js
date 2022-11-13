const player = require('../../events/client/player.js')
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current queue'),

    async execute(client, interaction) {
        const queue = player.getQueue(interaction.guildId)
        const embed = new EmbedBuilder()

        if (!queue?.playing)
            return interaction.reply({ content: "There is nothing playing" })

        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`
        });

        embed
            .setTitle('Song Queue')
            .setDescription(`${tracks.join("\n")}${
                queue.tracks.length > tracks.length
                    ? `\n...${
                          queue.tracks.length - tracks.length === 1
                              ? `${
                                    queue.tracks.length - tracks.length
                                } more track`
                              : `${
                                    queue.tracks.length - tracks.length
                                } more tracks`
                      }`
                    : ""
            }`)
            .setColor("Random")
            .addFields(
                {
                    name: "Now playing",
                    value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`
                }
            )
    }
}