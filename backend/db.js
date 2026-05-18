const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if(!mongoURI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(mongoURI);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectDB;