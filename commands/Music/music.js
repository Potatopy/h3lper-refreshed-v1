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
        .setName('music')
        .setDescription('All the music commands!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Play a song!')
                .addStringOption(option =>
                    option
                        .setName('query')
                        .setDescription('The URL to the song you want to play!')
                        .setRequired(true)

                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription('Change the volume of the music!')
                .addIntegerOption(option =>
                    option
                        .setName('percent')
                        .setDescription('The volume you want to set! (1-100)')
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('options')
                .setDescription('Settings for the current track!')
                .addStringOption(option =>
                    option
                        .setName('option')
                        .setDescription('The option you want to use!')
                        .addChoices(
                            {name: "queue", value: "queue"},
                            {name: "skip", value: "skip"},
                            {name: "pause", value: "pause"},
                            {name: "resume", value: "resume"},
                            {name: "stop", value: "stop"}
                        )
                
                )
                
        ),
        async execute(interaction) {
            const embed = new EmbedBuilder();
            
            const {options, member, guild, channel} = interaction;
            const subcommand = options.getSubcommand();
            const query = options.getString('query');
            const percent = options.getInteger('percent');
            const option = options.getString('option');
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
                switch (subcommand) {
                    case "play":
                        client.distube.play(voiceChannel, query, { textChannel: channel, member: member })
                        return interaction.reply({ content: "🎶 Request Recieved!" });
                    case "volume":
                        client.distube.setVolume(voiceChannel, percent)
                        return interaction.reply({ content: `🔉 Volume set to ${percent}%` });
                    case "options":
                        const queue = await client.distube.getQueue(voiceChannel);

                        if (!queue) {
                            embed.setColor("Red").setDescription('There is nothing playing!');
                            return interaction.reply({embeds: [embed], ephemeral: true});
                        }

                        switch (option) {
                            case "skip":
                                await queue.skip(voiceChannel);
                                embed.setColor("Green").setDescription("⏩ Skipped the song!");
                            case "stop":
                                await queue.stop(voiceChannel);
                                embed.setColor("Green").setDescription("Bye Bye! 👋");
                            case "pause":
                                await queue.pause(voiceChannel);
                                embed.setColor("Green").setDescription("⏸ Paused the song!");
                            case "resume":
                                await queue.resume(voiceChannel);
                                embed.setColor("Green").setDescription("▶ Resumed the song!");
                            case "queue":
                                embed.setColor("Purple").setDescription(`${queue.songs.map(
                                    (song, id) => `\n**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                                )}`)
                                return interaction.reply({ embeds: [embed] })
                        }
                
                    default:
                        break;
                }
            } catch (err) {
                console.log(err)
                embed.setColor("Red").setDescription('⛔ An error has occured! Check the console for more info! If you don\'t know what to do. Contact the developer!');
            }
        }
}