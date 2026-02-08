const mongoose = require('mongoose');

const shortenedSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true
    },
    Shortened: {
        type: String,
        required: true,
        unique: true
    },
    createdby: {
        type: String
    },
    expiresAt: {
        type: Date,
        default: null
    },
    visiters: {
        type: Number,
        default: null
    }
})

const Shortened = mongoose.model('Shortened', shortenedSchema);

module.exports = Shortened;