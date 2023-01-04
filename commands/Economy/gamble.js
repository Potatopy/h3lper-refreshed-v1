const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble your money')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of money to gamble')
                .setMinValue(100)
                .setRequired(true)
        ),
        async execute(interaction) {
            const { user, options } = interaction;
            const amount = options.getInteger('amount');
            const bankData = await bankSchema.findOne({ id: user.id }) || new bankSchema({ id: user.id });
            const embed = new EmbedBuilder()
                .setColor('Yellow')

            if (bankData.wallet < amount)
                return interaction.reply({
                    embeds: [
                        embed.setDescription(`⛔ Calm down you are not that rich!`)
                    ],
                    ephemeral: true
                })

            const random = Math.floor(Math.random() * 100) + 1;
            if (random > 50) {
                bankData.wallet += amount
                bankData.save();

                interaction.reply({
                    embeds: [
                        embed.setDescription(`✅ You won **\`${amount}\`**! You now have **\`${bankData.wallet}\`**`)
                    ]
                })
            } else {
                bankData.wallet -= amount
                bankData.save();

                interaction.reply({
                    embeds: [
                        embed.setDescription(`⛔ You lost **\`${amount}\`**! You now have **\`${bankData.wallet}\`**`)
                    ]
                })
            }
        }
}