require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
console.log('DB_URI:', process.env.DB_URI);

const port = process.env.PORT || 5000
const uri = process.env.DB_URI;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

connectDB();



app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/hello/:name', function(req, res) {
    res.send('Hello ' + req.params.name);
})

app.post('/login', function(req, res) {
    req.body
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});