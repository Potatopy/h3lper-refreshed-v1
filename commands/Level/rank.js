const xp = require('simply-xp')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('View a users rank')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User you want to view the level')
                .setRequired(false)
        ),

    async execute(client, interaction) {
        await interaction.reply();
        const member = interaction.options.getUser("target") || interaction.addUserOption

        xp.rank (interaction, member.id, interaction.guild.id, {
            background: "https://imgs.search.brave.com/2HVckz9O59JzhGCqbdXZTqsMd-653LxKKNUbbrhxaXw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/aWNvbG9ycGFsZXR0/ZS5jb20vd3AtY29u/dGVudC90aGVtZXMv/aWNvbG9ycGFsZXR0/ZS1jaGlsZC9zb2xp/ZC5waHA_Yz0zNjNl/NDQ",
            color: "#A0CFF1",
            lvlbar: "#A0CFF1",
            lvlbarBg: "#A0CFF1"
        }).then(async (img) => {
            await interaction.followUp({ files: [img] })
        })
    }
}