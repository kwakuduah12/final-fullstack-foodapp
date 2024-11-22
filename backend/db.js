const mongoose = require('mongoose');
const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};
module.exports = connectDB;
