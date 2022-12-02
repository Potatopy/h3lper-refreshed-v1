const { 
    SlashCommandBuilder,
    EmbedBuilder
 } = require('discord.js')
const afkSchema = require('../../models/afk.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set your status to AFK')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your afk status')
                .addStringOption(option =>
                    option
                        .setName('status')
                        .setDescription('Why you are afk')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('return')
                .setDescription('Return from afk')
        ),
    async execute(interaction) {
        const { guild, options, user, createdTimestamp } = interaction;

        const Embed = new EmbedBuilder()

        const afkStatus = options.getString('status')

        try {
            switch(options.getSubcommand()) {
                case 'set': {
                    await afkSchema.findOneAndUpdate({
                        GuildID: guild.id,
                        UserID: user.id
                    },
                    {
                        Status: afkStatus,
                        Time: parseInt(createdTimestamp / 1000)
                    },
                    {
                        new: true,
                        upsert: true
                    }
                    )

                    Embed.setColor("Green")
                    .setDescription(`You are now AFK: ${afkStatus}`)
                    return interaction.reply({ embeds: [Embed], ephemeral: true })
                }
                break;
                case 'return': {
                    await afkSchema.deleteOne({
                        GuildID: guild.id,
                        UserID: user.id
                    })
                    Embed.setColor("Green")
                    .setDescription(`Welcome back! You have been removed from your afk status`)
                    return interaction.reply({ embeds: [Embed], ephemeral: true })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}