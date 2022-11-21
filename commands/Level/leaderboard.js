const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Leaderboard of this server!'),
    async execute(interaction, client) {
        const { guildId } = interaction;
        const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10); // We grab top 10 users with most xp in the current server.
        const embed = new EmbedBuilder()
        const leaderboard = await Levels.computeLeaderboard(interaction.client, rawLeaderboard, true); // We process the leaderboard.
        const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`); // We map the outputs.

        if (rawLeaderboard.length < 1) return interaction.reply({ content: 'Nobody is on the leaderboard yet!', ephemeral: true })

        embed.setTitle('Leaderboard')
        .setDescription(lb.join("\n\n"))
        .setTimestamp()

        return interaction.reply({ embeds: [embed] });

    }
}