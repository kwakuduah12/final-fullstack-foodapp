require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//console.log('DB_URI:', process.env.DB_URI);

const port = process.env.PORT || 5000
const uri = process.env.DB_URI;

const app = express();
const UserRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const merchantRoutes = require('./routes/merchantsRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const CartRoutes = require('./routes/cartRoutes');  
const walletRoutes = require('./routes/walletRoutes');


app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/user', UserRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/menu', menuRoutes);
app.use('/merchant', merchantRoutes);
app.use('/order', orderRoutes);
app.use('/cart', CartRoutes);
app.use('/wallet', walletRoutes);

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



app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});