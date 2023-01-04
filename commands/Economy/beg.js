const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Beg for money (broke ahh mf)'),
    async execute(interaction) {
        const { user } = interaction;
        const bankData = await bankSchema.findOne({ id: user.id }) || new bankSchema({ id: user.id });
        const embed = new EmbedBuilder()
            .setColor('Yellow')

        if (bankData.cooldowns.beg > Date.now())
        return interaction.reply({
            embeds: [
                embed.setDescription(`⛔ I'm not made of money! You can beg again in: **\`${prettyMilliseconds(bankData.cooldowns.beg - Date.now(), { verbose: true, secondsDecimanDigits: 0 })}\`**`)
            ],
            ephemeral: true
        })

        const amount = Math.floor((Math.round(10 / (Math.random() * 10 + 1)) * 10) / 2);

        if (amount <= 5) {
            bankData.cooldowns.beg = Date.now() + (1000 * 60);
            bankData.save();

            return interaction.reply({
                embeds: [
                    embed.setDescription('All the humiliation and none of the reward - Stewie Griffin')
                ]
            })
        }

        bankData.wallet += amount; 
        bankData.cooldowns.beg = Date.now() + (1000 * 60);
        bankData.save();

        interaction.reply({
            embeds: [
                embed.setDescription(`✅ You begged and got **\`${amount}\`** (you got lucky)`)
            ]
        })
    }
}