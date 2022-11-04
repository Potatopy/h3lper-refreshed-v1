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
      option.setName("time")
        .setDescription("Length of mute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason")
        .setDescription("Why did you mute them?").setRequired(false)
    ),

    async execute(interaction) {
        const {guild, options} = interaction;

        const user = options.getUser("targer")
        const member = guild.members.cache.get(user.id)
        const time = options.getString("time")
        const convertedTime = ms(time);
        const reason = options.getString("reason") || "No reason provided!"

        const errEmbed = new EmbedBuilder()
    }
};
