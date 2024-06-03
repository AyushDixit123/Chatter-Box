const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();
console.log(process.env.PORT);
connectDB();

// Access environment variables
const PORT = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
    res.send('api running');
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
