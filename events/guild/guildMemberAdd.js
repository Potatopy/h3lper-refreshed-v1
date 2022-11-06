const { EmbedBuilder } = require('@discordjs/builders');
const { GuildMember } = require('discord.js');
const Schema = require('../../models/welcome');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if (!data) return;
            let channel = data.channel;
            let Msg = data.Msg || " ";
            let Role = data.Role

        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get(data.channel);

        const welcomeEmbed = new EmbedBuilder()
        .setTitle('**New Member**')
        .setDescription(data.Msg)
        .setColor([255, 0, 255])
        .addFields({name: 'Total members', value: `${guild.memberCount}`})
        .setTimestamp();

        welcomeChannel.send({content: `Welcome <@${member.id}>`, embeds: [welcomeEmbed]});
        member.roles.add(data.Role)
        })
    }
}