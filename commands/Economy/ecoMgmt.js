const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    PermissionFlagsBits,
    WebhookClient
} = require('discord.js')

const eco = require('../../data/EcoDB')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eco-staff')
        .setDescription('Modify a users balance')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('add-money')
                .setDescription('Add money to a users balance')
                .addUserOption((option) =>
                option
                    .setName('target')
                    .setDescription('User you want to give the money to')
                    .setRequired(true)
        )
        .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('How much you want to give')
            .setRequired(true)
        )
        
    )
    .addSubcommand((subcommand) => 
            subcommand
                .setName('remove-money')
                .setDescription('Removes money from a users balance')
                .addUserOption((option) =>
                option
                    .setName('target')
                    .setDescription('User you want to remove money from')
                    .setRequired(true)
        )
        .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('How much you want to remove')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => 
            subcommand
                .setName('set-money')
                .setDescription('Set balance of a user')
                .addUserOption((option) =>
                option
                    .setName('target')
                    .setDescription('User you want set the balance to')
                    .setRequired(true)
        )
        .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('How much you want to set')
            .setRequired(true)
        )
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, member } = interaction;
        const embed = new EmbedBuilder()
        const sub = interaction.options.getSubcommand()
        
        switch (sub) {
            case ('add-money'): {
                let Target = interaction.options.getUser('target') || member;
                let amount = interaction.options.getNumberOption('amount') || 1;
                eco.balance.add(amount, Target.id, guild.id)

                embed
                    .setTitle('Coins Successfully added!')
                    .setDescription(`Successfully added ${amount} coins to ${Target} balance!`)
                    .setColor('Random')
                    .setTimestamp()
                    .setFooter(`Made by Potatopy on github!`)

                interaction.reply({ embeds: [embed] })
            }
            break;
            case ('remove-money'): {
                let Target = interaction.options.getUser('target') || member;
                let amount = interaction.options.getNumberOption('amount') || 1;
                eco.balance.subtract(amount, Target.id, guild.id)

                embed
                    .setTitle('Coins Successfully removed!')
                    .setDescription(`Successfully removed ${amount} coins from ${Target} balance!`)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter(`Made by Potatopy on github!`)

                interaction.reply({ embeds: [embed] })
            }
            break;
            case ('set-money'): {
                let Target = interaction.options.getUser('target') || member;
                let amount = interaction.options.getNumberOption('amount') || 1;
                eco.balance.set(amount, Target.id, guild.id)

                embed
                    .setTitle('Successfully set balance!')
                    .setDescription(`Successfully set ${amount} coins to ${Target} balance!`)
                    .setColor('Random')
                    .setTimestamp()
                    .setFooter(`Made by Potatopy on github!`)

                interaction.reply({ embeds: [embed] })
            }
            break;
        
            default:
                break;
        }
    }
}