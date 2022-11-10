const xp = require("simply-xp")
const date = new Date()

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot || !message.guild) return;

        if (date.getDay() == 6) // double xp multiplyer
        xp.addXP(message, message.author.id, message.guild.id, {
            min: 50,
            max: 100
        });
    else
        xp.addXP(message, message.author.id, message.guild.id, {
            min: 1,
            max: 50
        })
    }    
}