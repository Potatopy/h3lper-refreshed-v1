const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('purges a specific number of messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => 
        option.setName('amount')
        .setDescription('Amount of messages to be purged! LIMIT = 99')
        .setRequired(true)
        )
    .addUserOption(option =>
        option.setName('target')
        .setDescription('User to delete all messages from. Messages < amount you requested')
        .setRequired(false)
        ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const amount = options.getInteger('amount');
        const target = options.getUser('target')

        const messages = await channel.messages.fetch({
            limit: amount +1,
        });

        const res = new EmbedBuilder()
            .setColor([128, 0, 128])

        if(target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount> i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Deleted ${messages.size} messages from ${target}`)
                interaction.reply({embeds: [res]})
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`Deleted ${messages.size} messages from the channel!`)
                interaction.reply({embeds: [res]})
            });
        }
    } 
}