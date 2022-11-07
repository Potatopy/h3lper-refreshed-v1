const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    WebhookClient
} = require('discord.js')

const eco = require('../../data/EcoDB')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eco')
        .setDescription('The whole Eco system!')
        .addSubcommand((subcommand) =>
        subcommand
            .setName('main')
            .setDescription('All the eco commands')
            .addStringOption((option) =>
        option
            .setName('types')
            .setDescription('Choose the command!')
            .setRequired(true)
            .setChoices(
                { name: 'Balance', value: 'balance' },
                { name: 'Daily', value: 'daily' },
                { name: 'Weekly', value: 'weekly' },
                { name: 'Coins Leaderboard', value: 'Coins Leaderboard' },
                { name: 'Bank Leaderboard', value: 'bank leaderboard' },
                { name: 'Inventory', value: 'inventory' }, 
            )
        )
    )
    .addSubcommand((subcommand) => 
    subcommand
        .setName('money')
        .setDescription('Money Types')
        .addStringOption((option) =>
        option
            .setName('types')
            .setDescription('Choose the command!')
            .setRequired(true)
            .setChoices(
                { name: 'Deposit', value: 'deposit' },
                { name: 'Withdraw', value: 'withdraw' },                
            )
        )
        .addNumberOption((option) =>
        option
            .setName('amount')
            .setDescription('How much?')
            .setRequired(true)
        )
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand()

        switch (sub) {
            case ('main'): {

            }
            break;
            case ('money') : {
                const Type = interaction.options.getString('types')

                switch(Type) {
                    case('Balance') : {
                        
                    }
                }
                break;
            }
            break;
            default:
                break;
        }
    }
}