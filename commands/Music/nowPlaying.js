const player = require('../../events/client/player.js')
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('View what is currently playing'),
    async execute(client, interaction) {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing) 
            return interaction.reply({ content: "No music is being played." });

        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You need to be in a vc to run this command' })

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        const embed = new EmbedBuilder()
            .setTitle("Now Playing")
            .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`)
            .addFields(
               {name: "\u200b", value: progress}
            )
            .setColor('Aqua')
            .setFooter(`Queued by ${queue.current.requestedBy.tag}`)

        return interaction.reply({ embeds: [embed] })
    }
}