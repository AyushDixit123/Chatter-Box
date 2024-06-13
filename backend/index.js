const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatRoutes =require('./routes/chatRoutes')
const userRoutes= require('./routes/userRoutes');
const messageRoutes=require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors')

// Load environment variables from .env file
dotenv.config();
//console.log(process.env.PORT);
connectDB();

// Access environment variables
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
// Enable CORS
app.use(cors());

  // app.get('/api/user', (req, res) => {
  //     res.send('api running');
  // });
//The first argument to app.use() is the base path for the middleware. In this case, '/' means that userRoutes will be applied to the root path of the application.
//This means that any routes defined in userRoutes will be accessible directly from the root path.
app.use('/api/user',userRoutes);

app.use('/api/chat',chatRoutes)

app.use("/api/message", messageRoutes)

app.use(notFound);
app.use(errorHandler)

//setting uo socket.io
const server=app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

const io=require('socket.io')(server,{
  pingTimeout:60000, //if user didn't send message for 60secs it will close the connection 
  cors:{
    origin:"http://localhost:5173"
  }
})

io.on("connection",(socket) => {
  console.log("connected to socket.io");

  socket.on('setup',(userData) =>{

    socket.join(userData._id); //room created and exclusive to user
    console.log(userData._id)
    socket.emit("connected")

  });
//taking roomid form frontend
  socket.on('join chat', (room) => {

    socket.join(room);
    console.log("User joined room" + room)


  })
})