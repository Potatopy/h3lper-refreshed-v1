const {
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes the user specified.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User you want to mute!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("time").setDescription("Length of mute").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why did you mute them?")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("target");
    const member = guild.members.cache.get(user.id);
    const time = options.getString("time");
    const convertedTime = ms(time);
    const reason = options.getString("reason") || "No reason provided!";

    const errEmbed = new EmbedBuilder()
      .setDescription(
        "Something went wrong. Please check the code or try again later."
      )
      .setColor([244, 67, 54]);

    const successEmbed = new EmbedBuilder()
      .setTitle("***:white_check_mark: no talking stick***")
      .setDescription(`stfu ${user}`)
      .addFields(
        { name: "Reason", value: `${reason}`, inline: true },
        { name: "Duration", value: `${time}`, inline: true }
      )
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

    if (!convertedTime)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      await member.timeout(convertedTime, reason)
      interaction.reply({ embeds: [successEmbed] })
    } catch (err) {
      console.log(err)
    }
  },
};
