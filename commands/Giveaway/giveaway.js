const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelTypes,
} = require("discord.js");
const ms = require("ms");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Full Giveaway System!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start a giveaway!")
        .addStringOption((option) =>
          option
            .setName("length")
            .setDescription(
              "How long you want the giveaway to last? FORMAT `1d, 1h, 1m, 1s`"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("What is the prize?")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("How many winners? It Defaults to 1")
            .setRequired(false)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("What channel do you want the giveaway to be in?")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pause")
        .setDescription("Pauses a giveaway!")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("What Giveaway you want to pause?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("resume")
        .setDescription("Resumes a giveaway!")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("What Giveaway you want to resume?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("end")
        .setDescription("Ends a giveaway!")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("What Giveaway you want to end?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Reroll a giveaway!")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("What Giveaway you want to reroll?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete A Giveaway!")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("What Giveaway you want to delete?")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const { options, channel, guildId } = interaction;
    const sub = options.getSubcommand();

    const errorEmbed = new EmbedBuilder().setColor("Red");
    const successEmbed = new EmbedBuilder().setColor("Green");

    if (sub == "start") {
      const gchannel = options.getChannel("channel") || channel;
      const duration = ms(options.getString("length"));
      const winnerCount = options.getInteger("winners") || 1;
      const prize = options.getString("prize");

      if (isNaN(duration)) {
        errorEmbed.setDescription(
          "Enter the correct length format `d, h, m, s`"
        );
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      return client.giveawaysManager
        .start(gchannel, {
          duration: duration,
          winnerCount,
          prize,
          messages: client.giveawaysConfig.messages,
        })
        .then(async () => {
          if (client.giveawaysConfig.giveawaysManager.everyoneMention) {
            const msg = await gchannel.messages.fetch("@everyone");
            msg.delete();
          }
          successEmbed.setDescription(`Giveaway started in ${gchannel}`);
          return interaction.reply({ embeds: [successEmbed] });
        })
        .catch((err) => {
          console.log(err);
          errorEmbed.setDescription(
            `Something went wrong! Error: \n\`${err}\``
          );
          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    }

    const messageId = options.getString("message-id");
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === guildId && g.messageId === messageId);
    
    if (sub === "pause") {
      if (giveaways.isPaused) {
        errorEmbed.setDescription("its already paused :skull:");
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
      await client.giveawaysManager
        .pause(messageId, {
          content: client.giveawaysConfig.messages.pause,
          infiniteDurationText: client.giveawaysConfig.messages.infiniteDuration,
        })
        .then(() => {
          successEmbed.setDescription("Giveaway paused!");
          return interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch((err) => {
          console.log(err);
          errorEmbed.setDescription(
            `Something went wrong! Error: \n\`${err}\``
          );
          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    }

    if (sub === "resume") {
      client.giveawaysManager
        .unpause(messageId)
        .then(() => {
          successEmbed.setDescription("Giveaway resumed!");
          return interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch((err) => {
          console.log(err);
          errorEmbed.setDescription(
            `Something went wrong! Error: \n\`${err}\``
          );
          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    }

    if (sub === "end") {
      client.giveawaysManager
        .end(messageId)
        .then(() => {
          successEmbed.setDescription("Giveaway Ended!");
          return interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch((err) => {
          console.log(err);
          errorEmbed.setDescription(
            `Something went wrong! Error: \n\`${err}\``
          );
          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    }

    if (sub == "reroll") {
      client.giveawaysManager
        .reroll(messageId, {
          messages: {
            congrat: client.giveawaysConfig.messages.reroll,
            error: client.giveawaysConfig.messages.noWinner,
          },
        })
        .then(() => {
          successEmbed.setDescription("New Winner!");
          return interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch((err) => {
          console.log(err);
          errorEmbed.setDescription(
            `Something went wrong! Error: \n\`${err}\``
          );
          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    }

    if (sub == "delete") {
      await client.giveawaysManager
        .delete(messageId)
        .then(() => {
          successEmbed.setDescription("Deleted the giveaway!");
          return interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch((err) => {
          console.log(err);
          errorEmbed.setDescription(
            `Something went wrong! Error: \n\`${err}\``
          );
          return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    }
  },
};
