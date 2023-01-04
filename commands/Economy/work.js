const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const bankSchema = require('../../models/bank');
const prettyMilliseconds = require('pretty-ms');

const jobs = [
    "👨‍🏫 Teacher",
    "👨‍⚕️ Doctor",
    "👮‍♂️ Police Officer",
    "👨‍🍳 Chef",
    "👨‍🚒 Firefighter",
    "🚌 Bus Driver",
    "👨‍🔬 Scientist",
    "📮 Mailman",
    "👨‍🔧 Engineer",
    "👨‍💻 Programmer",
    "👨‍🎨 Artist",
    "👨‍✈️ Pilot",
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work for money (JOBS ARE RANDOMIZED)'),
    async execute(interaction) {
        const { user } = interaction;
        const bankData = await bankSchema.findOne({ id: user.id }) || new bankSchema({ id: user.id });

        if (bankData.cooldowns.work > Date.now()) {
            const em = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(`⏳  You can work in **\`${prettyMilliseconds(bankData.cooldowns.work - Date.now(), { verbose: true, secondsDecimanDigits: 0 })}\`**`)
            return interaction.reply({ embeds: [em], ephemeral: true });
        }

        const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        bankData.wallet += amount;
        bankData.cooldowns.work = Date.now() + (1000 * 60 * 60);
        bankData.save();

        const em = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅  You worked as a **${job}** and earned **\`${amount}\`**`)
        await interaction.reply({ embeds: [em] });
    }
}