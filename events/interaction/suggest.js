const {
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js')
const suggestionSchema = require('../../models/suggestion.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const {member, guildId, customId, message} = interaction;

        if (!interaction.isButton()) return;
        
        if (customId == "suggest-accept" || customId == "suggest-deny") {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))
                return interaction.reply({ content: "You do not have the permissons for that", ephemeral: true })

            suggestionSchema.findOne({ GuildID: guildId, MessageID: message.id }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "You did not setup this function yet!", ephemeral: true })

                const embed = message.embeds[0];

                if (!embed)
                    return interaction.reply({ content: "No Embeds were found", ephemeral: true })

                switch (customId) {
                    case "suggest-accept":
                        embed.data.fields[2] = {name: "Status", value: "Accepted", inline: true};
                        const acceptEmbed = EmbedBuilder.from(embed).setColor("Green")

                        await message.edit({ embeds: [acceptEmbed] })
                        interaction.reply({ content: "Suggestion Accepted!", ephemeral: true })
                    break;
                    
                    case "suggest-deny":
                        embed.data.fields[2] = {name: "Status", value: "Declined", inline: true};
                        const denyEmbed = EmbedBuilder.from(embed).setColor("Red")

                        await message.edit({ embeds: [denyEmbed] })
                        interaction.reply({ content: "Suggestion Declined!", ephemeral: true })
                    break;
                }
            })
        }
    }
}