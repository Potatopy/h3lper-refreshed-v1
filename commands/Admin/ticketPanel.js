const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js')
const TicketSetup = require("../../models/ticketsetup")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticketpanel")
    .setDescription("Create a ticket panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => 
        option.setName("channel")
            .setDescription("Where do you want the tickets to be created.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option => 
            option.setName("category")
                .setDescription("What Category are the tickets and all the other stuff going to be stored?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option => 
            option.setName("transcripts")
                .setDescription("Where do you want the transcripts to be stored.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option => 
            option.setName("handlers")
            .setDescription("Roles you want to manage the tickets")
            .setRequired(true)
        )
        .addRoleOption(option => 
            option.setName("everyone")
            .setDescription("Tag the everyone role.")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("description")
            .setDescription("Set the description for the ticket panel")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("buttonone")
            .setDescription("Format: (Name of button, Emoji)")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("buttontwo")
            .setDescription("Format: (Name of button, Emoji)")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("buttonthree")
            .setDescription("Format: (Name of button, Emoji)")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("buttonfour")
            .setDescription("Format: (Name of button, Emoji)")
            .setRequired(true)
        ),
        
    async execute(interaction) {
        const { guild, options } = interaction;

        try {
            const channel = options.getChannel("channel")
            const category = options.getChannel("category")
            const transcripts = options.getChannel("transcripts")

            const handlers = options.getRole("handlers")
            const everyone = options.getRole("everyone")

            const description = options.getString("description")
            const buttonone = options.getString("buttonone").split(",")
            const buttontwo = options.getString("buttontwo").split(",")
            const buttonthree = options.getString("buttonthree").split(",")
            const buttonfour = options.getString("buttonfour").split(",")

            const emoji1 = buttonone[1]
            const emoji2 = buttontwo[1]
            const emoji3 = buttonthree[1]
            const emoji4 = buttonfour[1]

            await TicketSetup.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers.id,
                    Everyone: everyone.id,
                    Description: description.id,
                    Buttons: [buttonone[0], buttontwo[0], buttonthree[0],  buttonfour[0],]
                },
                {
                    new: true,
                    upsert: true
                }
            );

        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId(buttonone[0]).setLabel(buttonone[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
            new ButtonBuilder().setCustomId(buttontwo[0]).setLabel(buttontwo[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
            new ButtonBuilder().setCustomId(buttonthree[0]).setLabel(buttonthree[0]).setStyle(ButtonStyle.Primary).setEmoji(emoji3),
            new ButtonBuilder().setCustomId(buttonfour[0]).setLabel(buttonfour[0]).setStyle(ButtonStyle.Success).setEmoji(emoji4),
        );

        const embed = new EmbedBuilder()
            .setDescription(description)

        await guild.channels.cache.get(channel.id).send({
            embeds: ([embed]),
            components: [
                button
            ]
        });

        interaction.reply({content: "Ticket panel has been set", ephemeral: true})
        } catch (err) {
            console.log(err);
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Something went wrong... Try again later.")

            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
        }
    }
}