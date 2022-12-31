const {readdirSync} = require('fs');
const chalk = require('chalk');

module.exports = (client) => {
    if (client.giveawaysConfig.giveawayManager.privateMessageInformation) {
        readdirSync('./GiveawaysEvents/').forEach(async (dir) => {
            const events = readdirSync(`./GiveawaysEvents/${dir}`).filter(file => file.endsWith('.js'));
            
            for (const file of events) {
                const event = require(`../GiveawaysEvents/${dir}/${file}`)
                if (event.name) {
                    console.log(chalk.cyan(`[GIVEAWAY EVENTS]`) + `Event ${file.split("."[0])} loaded!`)

                    client.giveawaysManager.on(event.name, (...args) => event.execute(...args, client));
                    delete require.cache[require.resolve(`${__dirname}/../GiveawaysEvents/${dir}/${file}`)]
                } else {
                    console.log(chalk.red(`[GIVEAWAY EVENTS]`) + `Failed to load event: ${file.split("."[0])}!`);
                    continue;
                }
            }
        });
    } else {
        return console.log(chalk.yellow(`[WARNING]`) + `Private message information is disabled!`);
    }
}