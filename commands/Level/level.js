const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js')
const Levels = require('discord-xp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Adjust the levels of a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add level to a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to add levels to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of levels you want to add')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove levels from a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to remove levels from')
                        .setRequired(true)
                    )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of levels you want to remove')
                        .setMinValue(0)
                        .setRequired(true)
                    )   
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set the levels of a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to set levels for')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of levels you want to set')
                        .setMinValue(0)
                        .setRequired(true)
                )
        ),
    
        async execute(interaction) {
            const {options, guildId} = interaction;

            const sub = options.getSumbcommand();
            const user = options.getUser('user');
            const amount = options.getInteger('amount');
            const embed = new EmbedBuilder();

            try {
                switch (sub) {
                    case "add":
                        await Levels.appendLevel(guildId, user.id, amount);
                        embed.setDescription(`Added ${amount} level(s) to ${user}`).setColor("Green").setTimestamp();
                        break;
                    case "remove":
                        await Levels.subtractLevel(guildId, user.id, amount);
                        embed.setDescription(`Removed ${amount} level(s) from ${user}`).setColor("Green").setTimestamp();
                        break;
                    case "set":
                        await Levels.setLevel(guildId, user.id, amount);
                        embed.setDescription(`Set ${user} level(s) to ${amount}`).setColor("Green").setTimestamp();
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.log(err);
            }
            
            interaction.reply({ embeds: [embed] })

        }
}