const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  GuildVerificationLevel,
  GuildExplicitContentFilter,
  GuildNSFWLevel,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View the info of this server")
    .setDMPermission(false),

  async execute(interaction) {
    const { guild } = interaction;
    const { members, channels, emojis, roles, stickers } = guild;

    const sortedRoles = roles.cache
      .map((role) => role)
      .slice(1, roles.cache.size)
      .sort((a, b) => b.position - a.position);
    const userRoles = sortedRoles.filter(role => !role.managed);
    const managedRoles = sortedRoles.filter(role => role.managed);
    const botCount = members.cache.filter(members => members.user.bot).sizeM;

    const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];

      for (const role of roles) {
        const roleString = `<@&${role.id}>`;

        if (roleString + totalLength > maxFieldLength) break;

        totalLength += roleString.length + 1;
        result.push(roleString);
      }

      return result.length;
    };

    const splitPascal = (string, seperator) =>
      string.split(/(?=[A-U])/).join(seperator);
    const toPascalCase = (string, seperator = false) => {
      const pascal =
        string.charAt(0).toUpperCase() +
        string
          .slice(1)
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
      return seperator ? splitPascal(pascal, seperator) : pascal;
    };

    const getChannelTypeSize = (type) =>
      channels.cache.filter((channel) => type.includes(channel.type)).size;
    const totalChannels = getChannelTypeSize([
      ChannelType.GuildText,
      ChannelType.GuildNews,
      ChannelType.GuildStore,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
      ChannelType.GuildForum,
      ChannelType.GuildCategory,
      ChannelType.GuildNewsThread,
      ChannelType.GuildPublicThread,
      ChannelType.GuildPrivateThread,
    ]);
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${guild.name}'s info`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setImage(guild.bannerURL({ size: 1024 }))
      .addFields(
        { name: "Description", value: `📝${guild.description || "None"}` },
        {
          name: "General",
          value: [
            `📜 **Created At <t:${parseInt(
              guild.createdTimestamp / 1000
            )}:R>**`,
            `💳 **ID** ${guild.id}`,
            `👑 **Owner** <@${guild.ownerId}>`,
            `🌎 **Language ${new Intl.DisplayNames(["en"], {
              type: "language",
            }).of(guild.preferredLocale)}**`,
            `💻 **Vanity URL ${guild.vanityURLCode || "None"}**`,
          ].join("\n"),
        },
        {
          name: "Features",
          value: guild.features
            ?.map((feature) => `- ${toPascalCase(feature, "")}`)
            ?.join("\n"),
          inline: true,
        },
        {
          name: "Security",
          value: [
            `👀 **Explit Filter** ${splitPascal(
              GuildExplicitContentFilter[guild.explicitContentFilter],
              " "
            )}`,
            `🔞 **NSFW Level** ${splitPascal(
              GuildNSFWLevel[guild.nsfwLevel],
              " "
            )}`,
            `🔒 **Verification Level** ${splitPascal(
              GuildVerificationLevel[guild.verificationLevel],
              " "
            )}`,
          ].join("\n"),
          inline: true,
        },
        // {
        //   name: `Member (${guild.memberCount})`, Disabled cuz botCount is undefined
        //   value: [
        //     `👪 **Humans** ${guild.memberCount - botCount}`,
        //     `🤖 **Bots** ${botCount}`,
        //   ].join("\n"),
        //   inline: true,
        // },
        {
          name: `User Roles (${maxDisplayRoles(userRoles)} of ${
            userRoles.length
          })`,
          value: `${
            userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "None"
          }`,
        },
        {
          name: `Bot Roles (${maxDisplayRoles(managedRoles)} of ${
            managedRoles.length
          })`,
          value: `${
            managedRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") ||
            "None"
          }`,
        },
        {
          name: "Channels, Threads and Categories",
          value: [
            `💬 **Text Channels** ${getChannelTypeSize([
              ChannelType.GuildText,
              ChannelType.GuildNews,
              ChannelType.GuildNews,
            ])}`,
            `🔊 **Voice Channels** ${getChannelTypeSize([
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice,
            ])}`,
            `🧵 **Threads** ${getChannelTypeSize([
              ChannelType.GuildNewsThread,
              ChannelType.GuildPublicThread,
              ChannelType.GuildPrivateThread,
            ])}`,
            `📃 **Categories** ${getChannelTypeSize([
              ChannelType.GuildCategory,
            ])}`,
          ].join("\n"),
          inline: true,
        },
        {
          name: `Emojis + Stickers (${
            emojis.cache.size + stickers.cache.size
          })`,
          value: [
            `📺 **Animated** ${
              emojis.cache.filter((emoji) => emoji.animated).size
            }`,
            `🪑 **Static** ${
              emojis.cache.filter((emoji) => !emoji.animated).size
            }`,
            `🥌 **Stickers** ${stickers.cache.size}`,
          ].join("\n"),
          inline: true,
        },
        {
          name: `Boosters <3`,
          value: [
            `📈 **Boost Level** ${guild.premiumTier || "None"}`,
            `💪 **Boosts** ${guild.premiumSubscriptionCount || "None"}`,
            `💎 **Boosters** ${
              guild.members.cache.filter(
                (member) => member.roles.premiumSubscriberRole
              ).size
            }`,
            `🏋️‍♀️ **Total Boosters** ${
              guild.members.cache.filter((member) => member.roles.premiumSince)
                .size
            }`,
          ].join("\n"),
          inline: true,
        },
        { name: "Banner", value: guild.bannerURL() ? "** **" : "Keine" }
      );
    interaction.reply({ embeds: [embed] });
  },
};
