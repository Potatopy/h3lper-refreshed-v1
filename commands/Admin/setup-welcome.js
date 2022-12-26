const { Message, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSchema = require('../../models/welcome');
const { model, Schema } = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Set your own welcome message!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName("channel")
        .setDescription("Channel for welcome message!")
        .setRequired(true)    
    )
    .addStringOption(option => 
        option.setName("welcome-msg")
        .setDescription("Enter your message")
        .setRequired(true)
    )
    .addRoleOption(option => 
        option.setName('welcome-role')
        .setDescription('What role do you want to give when joined?')
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const welcomeChannel = options.getChannel("channel")
        const welcomeMessage = options.getString("welcome-msg")
        const roleId = options.getRole("welcome-role")

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({content: "I do not have the correct permissions to run this command!", ephemeral: true})
        }

        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
            if (!data) {
                const newWelcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage,
                    Role: roleId.id
                });
            }
            interaction.reply({content: 'Successfully created welcome message!', ephemeral: true})
        })
    }
}