const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes= require('./routes/userRoutes')


// Load environment variables from .env file
dotenv.config();
console.log(process.env.PORT);
connectDB();

// Access environment variables
const PORT = process.env.PORT;

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send('api running');
});
app.use('/',userRoutes)


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
