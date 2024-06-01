const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
console.log(process.env.PORT);

// Access environment variables
const PORT = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
    res.send('api running');
});

app.listen(3000, () => {
    console.log(`Server started on ${PORT}`);
});
