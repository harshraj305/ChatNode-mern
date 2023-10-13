const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const path = require('path');


dotenv.config();
connectDB();
const app = express();

app.use(express.json());  // to accept the json data

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// -------------------Deployment-------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    });

    // Add a route for the root URL ("/")
    // app.get('/', (req, res) => {
    //     res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    // });
} else {
    app.get('/', (req, res) => {
        res.send('Api running successfully');
    });
}

// -------------------Deployment-------------------

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT} ....`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
});

io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User joined room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
    });

    socket.off('setup', () => {
        console.log('User DISCONNECTED');
        socket.leave(userData._id);
    });
});