const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createverify')
    .setDescription('Creates a verification panel')
    .addChannelOption(option => 
        option.setName('channel')
        .setDescription('Send verification panel.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const verifyEmbed = new EmbedBuilder()
        .setTitle("**Verification Required**")
        .setDescription("Click the 'Verify Now!' Button to access the server!")
        .setColor('Blurple')
        let sendChannel = channel.send({
            embeds: ([verifyEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('verify').setLabel('Verify Now!').setStyle(ButtonStyle.Success),
                ),
            ],
        });
        if (!sendChannel) {
            return interaction.reply({content: 'Oops! An error occured. Check the console or the code if it\'s correct!', ephemeral: true})
        } else {
            return interaction.reply({content: 'Verification Panel has been posted!', ephemeral: true})
        }
    }
}