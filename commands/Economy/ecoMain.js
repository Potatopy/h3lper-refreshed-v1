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
                { name: 'Balance', value: 'Balance' },
                { name: 'Daily', value: 'Daily' },
                { name: 'Weekly', value: 'Weekly' },
                { name: 'Coins Leaderboard', value: 'Coins Leaderboard' },
                { name: 'Bank Leaderboard', value: 'Bank Leaderboard' },
                { name: 'Inventory', value: 'Inventory' }, 
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
                { name: 'Deposit', value: 'Deposit' },
                { name: 'Withdraw', value: 'Withdraw' },                
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
        const embed = new EmbedBuilder();
        const { guild, member } = interaction

        switch (sub) {
            case ('main'): {

            }
            break;
            case ('money') : {
                const Type = interaction.options.getString('types')

                switch(Type) {
                    case('Balance') : {
                        let balance = eco.balance.fetch(member.id, guild.id)
                        let bank = eco.bank.fetch(member.id, guild.id)

                        if (!balance) balance = 0
                        if (!bank) bank = 0

                        embed
                            .setTitle(`**${interaction.member.user.username}**'s Balance!`)
                            .setDescription(`**${interaction.member.user.username} Balance + Bank**`)
                            .addFields(
                                {
                                    name: 'Current Balance',
                                    value: `$${balance}`,
                                    inline: true
                                },
                                {
                                    name: 'Current Bank',
                                    value: `$${bank}`,
                                    inline: true
                                }
                            )
                            .setTimestamp()
                            .setColor('Green')
                            .setFooter('Made by Potatopy on GitHub')

                        interaction.reply({ embeds: [embed] })
                    }
                    break;
                    case('Daily') : {
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
                            .setFooter('Made by Potatopy in github')
                        interaction.reply({ embeds: [embed] })
                    }
                    break;
                    case('Weekly') : {
                        let weekly = eco.rewards.getWeekly(member.id, guild.id)
                        if (!daily.status) {
                            embed
                                .setDescription(`You already have claimed your weekly reward`)
                                .setColor('Red')
                            return interaction.reply({ embeds: [embed] })
                        }

                        embed
                            .setTitle('Weekly Rewards')
                            .setDescription(`You have recieved **$${weekly.reward}**`)
                            .setColor('Green')
                            .setFooter('Made by Potatopy in github')
                        interaction.reply({ embeds: [embed] })
                    }
                    break;
                    case('Coins Leaderboard') : {
                        let lb = eco.balance.leaderboard(guild.id);
                        if (!lb.length) {
                            return interaction.reply(
                                {
                                    content: `No one has any coins. Be the first one.`
                                }
                            )
                        }
                        
                        let leaderboard = await lb.map((value, index) => {
                            return `\`${index + 1}\`<@${value.userID}>'s Coins: **${value.money}**`
                    })

                    embed
                        .setColor('Random')
                        .setTitle('Coins Leaderboard')
                        .setDescription(leaderboard.join('\n'))
                        .setFooter('Made by Potatopy on github!')

                    interaction.reply({ embeds: [embed] })
                    }
                    break;
                    case('Bank Leaderboard') : {
                        let lb = eco.bank.leaderboard(guild.id);
                        if (!lb.length) {
                            return interaction.reply(
                                {
                                    content: `No one has any coins in their bank. Don't be greedy!`
                                }
                            )
                        }
                        
                        let leaderboard = await lb.map((value, index) => {
                            return `\`${index + 1}\`<@${value.userID}>'s Bank: **${value.money}**`
                    })

                    embed
                        .setColor('Random')
                        .setTitle('Bank Leaderboard')
                        .setDescription(leaderboard.join('\n'))
                        .setFooter('Made by Potatopy on github!')

                    interaction.reply({ embeds: [embed] })
                    }
                    break;
                    case('Inventory') : {
                        const inv = eco.inventory.fetch(member.id, guild.id)
                        if (!inv.length) {
                            interaction.reply(
                                {
                                    content: `There is nothing in your inventory`,
                                    ephemeral: true
                                }
                            )
                        }

                        let invMap = inv.map((x, i) => `ID: ${i + 1}: ${x.name}`)

                        embed
                            .setTitle('Inventory')
                            .setDescription(invMap.join('\n'))
                            .setColor('Aqua')
                            .setFooter('Made by Potatopy on github!')
                        interaction.reply({ embeds: [embed] })
                    }
                    break;
                }
            }
            break;
            case ('money') : {
                const Type = interaction.options.getString('types')
                let amount = interaction.options.getNumber('amount')

                switch (Type) {
                    case ('Deposit') : {
                        let balance = eco.balance.fetch(member.id, guild.id)

                        if (amount > balance) return interaction.reply (
                            {
                                content: `You don't have enough money in your wallet you brokie :clown:`
                            }
                        )

                        eco.balance.subtract(amount, member.id, guild.id)
                        eco.bank.add(amount, member.id, guild.id)

                        embed
                            .setTitle('Deposit || Money to Wallet ||')
                            .setDescription(`Successfully deposited $${amount} in your bank!`)
                            .setColor('Green')
                            .setFooter('Made by Potatopy on Github!')

                    interaction.reply({ embeds: [embed] })
                    }
                    break;
                    case ('Withdraw') : {
                        let balance = eco.balance.fetch(member.id, guild.id)
                        let bank = eco.bank.fetch(member.id, guild.id)

                        if (amount > bank) return interaction.reply (
                            {
                                content: `You don't have enough money in your bank you brokie :clown:`
                            }
                        )

                        eco.balance.add(amount, member.id, guild.id)
                        eco.bank.subtract(amount, member.id, guild.id)

                        embed
                            .setTitle('Withdraw || Bank to Wallet ||')
                            .setDescription(`Successfully withdrawed $${amount} in your bank!`)
                            .setColor('Green')
                            .setFooter('Made by Potatopy on Github!')

                    interaction.reply({ embeds: [embed] })
                    }
                    break;
                }
            }
        }
    }
}