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
        .setName('queue')
        .setDescription('Display the current queue!'),

        async execute(interaction) {
            const embed = new EmbedBuilder();
            
            const {member, guild} = interaction;
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
                
                const queue = await client.distube.getQueue(voiceChannel);

                if (!queue) {
                    embed.setColor("Red").setDescription('There is nothing playing!');
                    return interaction.reply({embeds: [embed], ephemeral: true});
                }
               
                embed.setColor("Purple").setDescription(`${queue.songs.map(
                    (song, id) => `\n**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                )}`)
                return interaction.reply({ embeds: [embed] })
                
            } catch (err) {
                console.log(err)
                embed.setColor("Red").setDescription('⛔ An error has occured! Check the console for more info! If you don\'t know what to do. Contact the developer!');
            }
        }
}