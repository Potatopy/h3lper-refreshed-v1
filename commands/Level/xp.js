const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js')
const Levels = require('discord-xp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Adjust the XP of a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add XP to a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to add XP to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of XP you want to add')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove XP from a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to remove XP from')
                        .setRequired(true)
                    )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of XP you want to remove')
                        .setMinValue(0)
                        .setRequired(true)
                    )   
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set the XP of a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to set XP for')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of XP you want to set')
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
                        await Levels.appendXp(guildId, user.id, amount);
                        embed.setDescription(`Added ${amount} XP to ${user}`).setColor("Green").setTimestamp();
                        break;
                    case "remove":
                        await Levels.subtractXp(guildId, user.id, amount);
                        embed.setDescription(`Removed ${amount} XP from ${user}`).setColor("Green").setTimestamp();
                        break;
                    case "set":
                        await Levels.setXp(guildId, user.id, amount);
                        embed.setDescription(`Set ${user} XP to ${amount}`).setColor("Green").setTimestamp();
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