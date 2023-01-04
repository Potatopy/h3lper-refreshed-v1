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
        .setName('volume')
        .setDescription('Change the volume of the song!')
        .addIntegerOption(option =>
            option
                .setName('volume')
                .setDescription('The volume you want to set!')
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        ),

        async execute(interaction) {
            const embed = new EmbedBuilder();
            
            const {options, member, guild} = interaction;
            const volume = options.getInteger('volume');
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
                
                client.distube.setVolume(voiceChannel, volume)
                return interaction.reply({ content: `🔉 Volume set to ${volume}%` });
                
            } catch (err) {
                console.log(err)
                embed.setColor("Red").setDescription('⛔ An error has occured! Check the console for more info! If you don\'t know what to do. Contact the developer!');
            }
        }
}