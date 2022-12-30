const {
    EmbedBuilder,
    SlashCommandBuilder
} = require('discord.js');
const client = require('../../index.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song!')
        .addStringOption(option =>
            option
                .setName('options')
                .setDescription("Loop Options")
                .addChoices(
                    { name: 'off', value: 'off' },
                    { name: 'song', value: 'song' },
                    { name: 'queue', value: 'queue' },
                )
                .setRequired(true)
        ),
        async execute(interaction) {
            const {member, guild, options} = interaction;
            const option = options.getString('options');
            const voiceChannel = member.voice.channel;
            const embed = new EmbedBuilder();

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

                let mode = null;
                
                switch (option) {
                    case "off":
                        mode = 0
                        break;
                    case "song":
                        mode = 1
                        break;
                    case "queue":
                        mode = 2
                        break;
                }

                mode = await queue.setRepeatMode(mode);
                mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat Song") : "Off";

                embed.setColor("Orange").setDescription(`🔁 Set repeat mode to \`${mode}\``);
                return interaction.reply({ embeds: [embed] })
                
            } catch (err) {
                console.log(err)
                embed.setColor("Red").setDescription('⛔ An error has occured! Check the console for more info! If you don\'t know what to do. Contact the developer!');
            }

        }
}