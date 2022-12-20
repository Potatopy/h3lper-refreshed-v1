const {
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { execute } = require("./mute");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmites a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Who you want to unmute")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("target");
    const member = guild.members.cache.get(user.id);

    const errEmbed = new EmbedBuilder()
      .setDescription(
        "Something went wrong. Please check the code or try again later."
      )
      .setColor([244, 67, 54]);

    const successEmbed = new EmbedBuilder()
      .setTitle("***:white_check_mark: gave back the talking stick***")
      .setDescription(`you got a second chance ${user} don't sell`)
      .setColor([87, 48, 255])
      .setTimestamp();

      if (
        member.roles.highest.position >= interaction.member.roles.highest.position
      )
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
  
      if (
        !interaction.guild.members.me.permissions.has(
          PermissionFlagsBits.ModerateMembers
        )
      )
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null)
            interaction.reply({ embeds: [successEmbed] })
          } catch (err) {
            console.log(err)
          }
  },
};
