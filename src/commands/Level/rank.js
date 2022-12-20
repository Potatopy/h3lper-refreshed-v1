const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js')
const Levels = require('discord.js-leveling')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Get the rank of a user!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to get the rank of!')
                .setRequired(false)
            ),
    async execute(interaction) {
        const {options, guildId, user} = interaction;
        const member = options.getUser('user') || user;
        const levelUser = await Levels.fetch(member.id, guildId);
        const embed = new EmbedBuilder()

        if (!levelUser) return interaction.reply({ content: 'Looks like this user didnt talk at all, lmao', ephemeral: true })

        embed.setDescription(`**${member.tag}** is level **${levelUser.level}** and currently has ${levelUser.xp.toLocaleString()} xp!`)
        .setColor("Random")
        .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
}