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
        .setName('weekly')
        .setDescription('Claim your weekly coins!'),
    async execute(interaction, client) {
        const { guild, member } = interaction;
        let weekly = eco.rewards.getWeekly(member.id, guild.id)
            if (!weekly.status) {
                embed
                    .setDescription(`You already have claimed your weekly reward`)
                    .setColor('Red')
                    return interaction.reply({ embeds: [embed] })
            }

            embed
                .setTitle('Weekly Rewards')
                .setDescription(`You have recieved **$${weekly.reward}**`)
                .setColor('Green')
            
            interaction.reply({ embeds: [embed] })
    }
}