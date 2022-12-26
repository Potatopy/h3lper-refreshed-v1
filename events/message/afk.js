const { 
    EmbedBuilder
} = require('discord.js');
const afkSchema = require('../../models/afk.js')

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        await afkSchema.deleteOne({
            GuildID: message.guild.id,
            UserID: message.author.id
        })

        if (message.mentions.members.size) {
            const Embed = new EmbedBuilder()
            .setColor('Red')
            message.mentions.members.forEach((m) => {
                afkSchema.findOne({
                    GuildID: message.guild.id,
                    UserID: m.id
                }, async (err, data) => {
                    if (err) throw err;
                    if (data)
                    Embed.setDescription(`${m} went AFK <t:${data.Time}:R>\n **Status**: ${data.Status}`)
                    return message.reply({ embeds: [Embed] })
                })
            })
        }
    }
}