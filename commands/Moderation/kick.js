const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick the specified user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName("target")
            .setDescription("User you want ot kick")
            .setRequired(true)    
        )
    .addStringOption(option =>
       option.setName("reason")
       .setDescription("Why you kicked the user.")
        ),

        async execute(interaction) {
            const {channel, options} = interaction;

            const user = options.getUser("target")
            const reason = options.getString("reason") || "No reason provided!"

            const member = await interaction.guild.members.fetch(user.id)

            const errEmbed = new EmbedBuilder()
                .setDescription(`You can't kick ${user.username} since they have a higher priority than you.`)
                .setColor([114, 137, 218])

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true })

            await member.kick(reason)

            const embed = new EmbedBuilder()
                .setDescription(`kicked ${user} lol imagine :smoking:. Reason: ${reason}`)
            await interaction.reply({
                embeds: [embed]
            });
        }
}