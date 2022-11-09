const Economy = require('discord-economy-super/mongodb')
const token = require('../config.json')
const eco = new Economy({
    connection: {
        connectionURI: 'mongo db login',
        collectionName: 'collection',
        dbName: 'db',
    },
    updateCountdown: 1000,
    checkStorage: true,
    deprecationWarnings: true,
    sellingItemPercent: 75,
    savePurchasesHistory: true,
    dailyAmount: 350,
    workAmount: [50, 300],
    weeklyAmount: 5000,
    dailyCooldown: 60000 * 60 * 24,
    workCooldown: 60000 * 60,
    weeklyCooldown: 60000 * 60 * 24 * 7,
    dateLocale: 'en',
    updater: {
        checkUpdates: true,
        upToDateMessage: true,
    },
    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 3000,
    },
    optionsChecker: {
        ignoreInvalidOptions: false,
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: true,
    },
});

eco.on('ready', () => {
    console.log('Economy system is ready!')
})

module.exports = eco;