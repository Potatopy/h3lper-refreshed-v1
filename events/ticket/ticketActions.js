const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const { transcripts } = require('../../config.json');
const ticketSchema = require('../../models/ticket');

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ManageChannels, SendMessages } = PermissionFlagsBits;

        if (!interaction.isButton()) return; // if no button is present return

        if (!["close", "lock", "unlock"].includes(customId)) return; // If the button has none of these custom id's return

        if (!guild.members.me.permissions.has(ManageChannels))
            return interaction.reply({content: "I don't have the required permissions to do this. Give me the 'Manage Channel' Permission and try again!", ephemeral: true})

        const embed = new EmbedBuilder().setColor("Aqua");

        ticketSchema.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if(!data) return // If data is not found return (it wil, probably make its own db)

            const fetchedMember = await guild.members.cache.get(data.MemberID);

            switch (customId) {
                case "close":
                        if(data.closed == true)
                            return interaction.reply({content: "Ticket is being deleted. Please be patient. jeez...", ephemeral: true})

                        const transcript = await createTranscript(channel, {
                            limit: -1,
                            returnBuffer: false,
                            fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`
                        });

                        await ticketSchema.updateOne({ChannelID: channel.id}, {Closed: true});

                        const transcriptEmbed = new EmbedBuilder()
                            .setTitle(`Transcript Type: ${data.Type}\nId: ${data.TicketID}`)
                            .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true })})
                            .setTimestamp();

                        const transcriptProcesss = new EmbedBuilder()
                            .setTitle('Saving Transcript...')
                            .setDescription("Ticket will be closed in 10 seconds, enable DMs to view your ticket transcript!")
                            .setColor("Red")
                            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();

                        const res = await guild.channels.cache.get(transcripts).send({
                            embeds: [transcriptEmbed],
                            files: [transcript]
                        });

                        channel.send({ embeds: [transcriptProcesss] })

                        setTimeout(function () {
                            member.send({ 
                                embeds: [transcriptEmbed.setDescription(`Access your ticket transcript: ${res.url}`)]
                             }).catch(() => channel.send('Couldn\'t send transcript to user. They\'re DMs are off.'))
                             channel.delete();
                        }, 10000);
                    
                        break;
            
                    case "lock":
                        if (!member.permissions.has(ManageChannels))
                            return interaction.reply({ content: "You don't have perms for this action!", ephemeral: true })

                        if(data.Locked == true)
                            return interaction.reply({content: "Ticket is already locked!", ephemeral: true})

                        await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: true});
                        embed.setDescription("Ticket successfully locked! 🔐")

                        channel.permissionOverwrites.edit(fetchedMember, {SendMessages: false})

                        return interaction.reply({ embeds: [embed] })

                        break;

                    case "unlock":
                        if (!member.permissions.has(ManageChannels))
                            return interaction.reply({ content: "You don't have perms for this action!", ephemeral: true })

                        if(data.Locked == false)
                            return interaction.reply({content: "Ticket is already unlocked!", ephemeral: true})

                        await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: false});
                        embed.setDescription("Ticket successfully unlocked! 🔓")

                        channel.permissionOverwrites.edit(fetchedMember, {SendMessages: true})

                        return interaction.reply({ embeds: [embed] })
                default:
                    break;
            }
        })
    }
}