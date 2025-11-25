const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/urlShortener')
          .then(() => console.log('MongoDB connected'))
          .catch(err => console.error(err));
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;