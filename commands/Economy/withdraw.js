const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from your bank')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of money to withdraw')
                .setRequired(true)
                .setMinValue(100)
        ),
    async execute(interaction) {
        const { user, options } = interaction;
        const amount = options.getInteger('amount');
        const bankData = await bankSchema.findOne({ id: user.id }) || new bankSchema({ id: user.id });
        const embed = new EmbedBuilder()
            .setColor('Yellow')

        if (bankData.bank < amount)
            return interaction.reply({
                embeds: [
                    embed.setDescription(`⛔ Calm down you are not that rich!`)
                ],
                ephemeral: true
            })

            bankData.wallet += amount
            bankData.bank -= amount
            bankData.save();

            interaction.reply({
                embeds: [
                    embed.setDescription(`✅ You withdrew **\`${amount}\`** from your bank, you now have **\`${bankData.wallet}\`** in your wallet and **\`${bankData.bank}\`** in your bank`)
                ]
            })
    }
}