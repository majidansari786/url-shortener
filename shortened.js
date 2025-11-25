const mongoose = require('mongoose');

const shortenedSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true
    },
    Shortened: {
        type: String,
        required: true
    }
})

const Shortened = mongoose.model('Shortened', shortenedSchema);

module.exports = Shortened;