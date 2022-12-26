const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    WebhookClient
} = require('discord.js')

const eco = require('../../data/EcoDB')
const embed = new EmbedBuilder()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily coins!'),
    async execute(interaction, client) {
        const { guild, member } = interaction;
        let daily = eco.rewards.getDaily(member.id, guild.id)
            if (!daily.status) {
                embed
                    .setDescription(`You already have claimed your daily reward`)
                    .setColor('Red')
                    return interaction.reply({ embeds: [embed] })
            }

            embed
                .setTitle('Daily Rewards')
                .setDescription(`You have recieved **$${daily.reward}**`)
                .setColor('Green')

            interaction.reply({ embeds: [embed] })
    }
}