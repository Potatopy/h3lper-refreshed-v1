const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const suggestionSchema = require("../../models/suggestion.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest something to the server!")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Select an option")
        .setRequired(true)
        .addChoices(
          { name: "Bot Recommendation", value: "Bot" },
          { name: "Discord Server", value: "Server" },
          { name: "What to sell?", value: "Sell" },
          { name: "Other", value: "Other" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Describe the suggestion")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options, guildId, member, user, guild} = interaction;
        const type = options.getString("type");
        const description = options.getString("description");
        const channel = guild.channels.cache.get("1045325594440773723"); // Insert your own channel ID here
        
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: user.tag, iconUrl: user.displayAvatarURL({ dynamic: true }) })
        .addFields(
          {name: "Suggestion", value: description, inline: false},
          {name: "Type", value: type, inline: false},
          {name: "Status", value: "Pending", inline: false},
        )
        .setTimestamp()

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("suggest-accept").setLabel("Accept").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("suggest-deny").setLabel("Deny").setStyle(ButtonStyle.Secondary),
        );

        try {
          const m = await channel.send({ embeds: [embed], components: [buttons], fetchReply: true });
          await channel.send({ content: "Use the /suggest command to submit a suggestion" })
          await interaction.reply({ content: "Suggestion sent!", ephemeral: true });

          await suggestionSchema.create({
            GuildID: guildId, MessageID: m.id, Details:
            {
              MemberID: member.id,
              Type: type,
              Suggestion: description
            }
          })
        } catch (err) {
          console.log(err);
        }
    }
};
