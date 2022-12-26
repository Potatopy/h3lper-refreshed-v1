const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require('discord.js')
const logSchema = require('../../models/logs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-logs')
        .setDescription('Set up logging channel for audit logs')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel to log all the logs to.')
                .setRequired(false)
        ),

        async execute(interaction) {
            const { channel, guildId, options } = interaction;
            const logChannel = options.getChannel('channel') || channel;
            const embed = new EmbedBuilder();

            logSchema.findOne({ Guild: guildId }, async (err, data) => {
                if (!data) {
                    await logSchema.create({
                        Guild: guildId,
                        Channel: logChannel.id
                    });
                    
                    embed.setDescription("Data was successfully sent to the database!")
                    .setColor("Green")
                    .setTimestamp()
                } else if (data) {
                    logSchema.findOneAndDelete({ Guild: guildId })
                    await logSchema.create({
                        Guild: guildId,
                        Channel: logChannel.id
                    });
                    
                    embed.setDescription("Old data has been replaced with new data!")
                    .setColor("Green")
                    .setTimestamp()
                }

                if (err) {
                    embed.setDescription('Something went wrong. Please check the code, or contact the developers!')
                    .setColor("Red")
                    .setTimestamp()
                }

                return interaction.reply({ embeds: [embed], ephemeral: true })
            })
        }
}