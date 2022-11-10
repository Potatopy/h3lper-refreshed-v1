const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll and send it to a channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription("What is the poll question?")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("What channel is this going to be posted on?")
                .setRequired(true)
        ),
        async execute(interaction) {
            const { options } = interaction;

            const channel = options.getChannel("channel")
            const question = options.getString("question")

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(question)
                .setTimestamp()

            try {
                const m = await channel.send({ embeds: [embed] })
                await m.react("✅")
                await m.react("❌")
                await interaction.reply({ content: "Poll was successfully sent!", ephemeral: true })
            } catch (err) {
                console.log(err)
            }
        }
}