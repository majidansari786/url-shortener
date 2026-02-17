const mongoose = require('mongoose');
const dotenv  = require('dotenv')

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongodb_uri)
          .then(() => console.log('MongoDB connected'))
          .catch(err => console.error(err));
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;