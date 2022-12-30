const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    VoiceChannel,
    GuildEmoji,
    embedLength,
    channelLink
} = require('discord.js');
const client = require('../../index.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music in your voice channel!')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('The URL to the song you want to play!')
                .setRequired(true)
            ),

        async execute(interaction) {
            const embed = new EmbedBuilder();
            
            const {options, member, guild, channel} = interaction;
            
            const query = options.getString('query');
            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                embed.setColor("Red").setDescription('You need to be in a voice channel to use this command!');
                return interaction.reply({embeds: [embed], ephemeral: true});
            }

            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Red").setDescription(`I'm already playing music in <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({embeds: [embed], ephemeral: true});
            }

            try {
                
                client.distube.play(voiceChannel, query, { textChannel: channel, member: member })
                return interaction.reply({ content: "🎶 Request Recieved!" });
                
            } catch (err) {
                console.log(err)
                embed.setColor("Red").setDescription('⛔ An error has occured! Check the console for more info! If you don\'t know what to do. Contact the developer!');
            }
        }
}