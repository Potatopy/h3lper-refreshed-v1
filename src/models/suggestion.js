const {model, Schema} = require('mongoose');

let suggestion = new Schema({
    GuildID: String,
    MessageID: String,
    Details: Array
})

module.exports = model('suggestion', suggestion);