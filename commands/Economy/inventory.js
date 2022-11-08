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
        .setName('inventory')
        .setDescription('View your current inventory!'),

    async execute(interaction, client) {
        const { guild, member } = interaction;
        const inv = eco.inventory.fetch(member.id, guild.id)
        if (!inv.length) {
            interaction.reply(
                {
                    content: `There is nothing in your inventory! Buy something.`,
                    ephemeral: true
                }
            )
        }

        let invMap = inv.map((x, i) => `ID: ${i + 1}: ${x.name}`)

        embed
            .setTitle('Inventory')
            .setDescription(invMap.join('\n'))
            .setColor('Aqua')
        
        interaction.reply({ embeds: [embed] })
    }
}