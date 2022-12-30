const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js')
const Levels = require('discord-xp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('howmuchxp')
        .setDescription('How much XP is required for the next level')
        .addIntegerOption(option =>
            option
                .setName('level')
                .setDescription('THe level you want')
                .setRequired(true)
        ),
    
        async execute(interaction) {
            const {options} = interaction;

            const amount = options.getInteger('level');
            const xpAmount = Levels.xpFor(level);

            interaction.reply({ content: `You need ${xpAmount} xp to reach level ${level}` })

        }
}