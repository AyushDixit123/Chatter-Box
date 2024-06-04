const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatRoutes =require('./routes/chatRoutes')
const userRoutes= require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors')

// Load environment variables from .env file
dotenv.config();
console.log(process.env.PORT);
connectDB();

// Access environment variables
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
// Enable CORS
app.use(cors());

//  app.get('/api/user', (req, res) => {
//      res.send('api running');
//  });
//The first argument to app.use() is the base path for the middleware. In this case, '/' means that userRoutes will be applied to the root path of the application.
//This means that any routes defined in userRoutes will be accessible directly from the root path.
app.use('/api/user',userRoutes);

app.use('/api/chat',chatRoutes)

app.use(notFound);
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
