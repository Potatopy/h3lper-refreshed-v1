// Credits: Kaj on Youtube!

const { CommandInteraction } = require("discord.js");
const verifiedID = require('../../configs/config.json').verifiedID;

module.exports = {
  name: "interactionCreate",

  execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        interaction.reply({ content: "outdated command" });
      }
      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const { customId, guild, member } = interaction;

      if (customId == "verify") {
        const role = guild.roles.cache.get(verifiedID);
        return member.roles.add(role).then((member) =>
          interaction.reply({
            content: `${role} has been assigned to you.`,
            ephemeral: true,
          })
        );
      }
    } else {
      return;
    }
  },
};
