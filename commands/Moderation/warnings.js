const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const warningSchema = require("../../models/warning.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warning")
    .setDescription("Full warning command")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a warining to the user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User you want to warn")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Why did you warn this user?")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("evidence")
            .setDescription("Prove it. So we can review.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("Check the warnings of a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User you want to check")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a warining from a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User you want to remove a warning")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("Provide warning ID")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Clear ALL Warnings from a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User you want to clear")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { options, guildID, user, member } = interaction;

    const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
    const target = options.getUser("target");
    const reason = options.getString("reason") || "No reason provided.";
    const evidence = options.getString("evidence") || "None provided.";
    const warnId = options.getInteger("id") - 1;
    const warnDate = new Date(
      interaction.createdTimestamp
    ).toLocaleDateString();

    const userTag = `${target.username}#${target.discriminator}`;

    const embed = new EmbedBuilder();

    switch (sub) {
      case "add":
        warningSchema.findOne(
          { GuildID: guildID, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              data = new warningSchema({
                GuildID: guildID,
                UserID: target.tag,
                UserTag: userTag,
                Content: [
                  {
                    ExecuterId: user.id,
                    ExecuterTag: user.tag,
                    Reason: reason,
                    Evidence: evidence,
                    Date: warnDate,
                  },
                ],
              });
            } else {
              const warnContent = {
                ExecuterId: user.id,
                ExecuterTag: user.tag,
                Reason: reason,
                Evidence: evidence,
                Date: warnDate,
              };
              data.Content.push(warnContent);
            }
            data.save();
          }
        );

        embed
          .setColor("Green")
          .setDescription(
            `
                    Warning added: ${userTag} | || ${target.id} ||
                    **Reason**: ${reason}
                    **Evidence**: ${evidence}
                    `
          )
          .setFooter({
            text: member.user.tag,
            iconURL: member.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });

        break;
      case "check":
        warningSchema.findOne(
          { GuildID: guildID, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              embed
                .setColor("Green")
                .setDescription(
                  `${data.Content.map(
                    (w, i) =>
                      `**ID**: ${i + 1}
                                **By**: ${w.ExecuterTag}
                                ***Date**: ${w.Date}
                                **Reason**: ${w.Reason}
                                **Evidence**: ${w.Evidence}\n\n
                                `
                  ).join(" ")}`
                )
                .setFooter({
                  text: member.user.tag,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            } else {
              embed
                .setColor("Red")
                .setDescription(`${userTag} | ||${target.id}|| is clean!`)
                .setFooter({
                  text: member.user.tag,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );

        break;
      case "remove":
        warningSchema.findOne(
          { GuildID: guildID, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              data.Content.splice(warnId, 1);
              data.save();

              embed
                .setColor("Green")
                .setDescription(
                  `${userTag}'s warning id: ${warnId + 1} has been removed!`
                )
                .setFooter({
                  text: member.user.tag,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            } else {
              embed
                .setColor("Red")
                .setDescription(`${userTag} | ||${target.id}|| is clean!`)
                .setFooter({
                  text: member.user.tag,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );
        break;
      case "clear":
        warningSchema.findOne(
          { GuildID: guildID, UserID: target.id, UserTag: userTag },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              await warningSchema.findOneAndDelete({
                GuildID: guildID,
                UserID: target.id,
                UserTag: userTag,
              });

              embed
                .setColor("Green")
                .setDescription(
                  `${userTag}'s warnings have been cleared! | ||${target.id}||`
                )
                .setFooter({
                  text: member.user.tag,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            } else {
              embed
                .setColor("Red")
                .setDescription(`${userTag} | ||${target.id}|| is clean!`)
                .setFooter({
                  text: member.user.tag,
                  iconURL: member.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              interaction.reply({ embeds: [embed] });
            }
          }
        );
        break;

      default:
        break;
    }
  },
};
