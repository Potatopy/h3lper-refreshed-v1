const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Get your daily money'),
    async execute(interaction) {
        const { user } = interaction;
        const bankData = await bankSchema.findOne({ id: user.id }) || new bankSchema({ id: user.id });
        const embed = new EmbedBuilder()
            .setColor('Yellow')

        if (bankData.cooldowns.daily > Date.now())
        return interaction.reply({
            embeds: [
                embed.setDescription(`⛔ I'm not made of money, you can get your money again in: **\`${prettyMilliseconds(bankData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimanDigits: 0 })}\`**`)
            ],
            ephemeral: true
        })

        bankData.wallet += 500
        bankData.cooldowns.daily = new Date().setHours(24, 0, 0, 0);
        bankData.save();

        interaction.reply({
            embeds: [
                embed.setDescription(`✅ You got your daily money, you now have **\`${bankData.wallet}\`**`)
            ]
        })
    }
}
