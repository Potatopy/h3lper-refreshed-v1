const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your or another users balance!')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to check the balance of')
                .setRequired(false)
        ),
        async execute(interaction) {
            const { options } = interaction;

            const user = options.getUser('user') || interaction.user;
            const bankData = await bankSchema.findOne({ id: user.id }) || new bankSchema({ id: user.id });

            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Balance`)
                .setDescription("The bank and wallet of the user")
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: 'Wallet', value: `**\`${bankData.wallet} 💰 \`**`, inline: true },
                    { name: 'Bank', value: `**\`${bankData.bank} 🏦 \`**`, inline: true }
                )

            await interaction.reply({ embeds: [embed] });
        }
}