const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  
module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unbans the user id.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
        .setDescription("The discord ID you want to unban")
        .setRequired(true)
        ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const userId = options.getString("userid");

        try {
            await interaction.guild.members.unban(userId);
            
            const embed = new EmbedBuilder()
                .setDescription(`${userId} got a second chance, don't sell it`)
                .setColor([52, 209, 51])
                .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });
        } catch(err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`This user doesn't seem to exist.`)
                .setColor([255, 0, 0])

            interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }
    }
}