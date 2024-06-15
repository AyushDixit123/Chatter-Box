const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

connectDB();


// Access environment variables
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
// Enable CORS
app.use(cors());
app.get('/', (req, res) => {
    res.send('API is running...');
});

// API routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Setting up socket.io
const server = app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000, // if user didn't send message for 60 secs it will close the connection
    cors: {
        origin: "https://let-us-chat1.netlify.app"
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id); // room created and exclusive to user
        console.log(userData._id);
        socket.emit("connected");
    });

    // taking room id from frontend
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return ("chat.users not found");
        // ensuring everyone but the user receives the message sent by him

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });
});
