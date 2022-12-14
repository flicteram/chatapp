import 'express-async-errors';
import express from 'express';
import connectDB from './db/index.js';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import registerRouter from './api/register.js';
import authRouter from './api/auth.js';
import usersRouter from './api/users.js';
import refreshRouter from './api/refresh.js';
import logoutRouter from './api/logout.js';
import handleErrors from './middleware/handle-errors.js';
import verifyJWT from './middleware/verifyJWT.js';
import conversation from './api/conversation.js';
import conversations from './api/conversations.js';
import { updateUserDisconnect } from './controllers/users.js';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
// import handleCors from './middleware/handle-errors.js'
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
// middleware
// app.use(handleCors)
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json());
app.use(cookieParser());
// routes
app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/refresh', refreshRouter);
app.use(verifyJWT);
app.use('/api/users', usersRouter);
app.use('/api/conversation', conversation);
app.use('/api/conversations', conversations);
app.use(handleErrors);
// start
let users = [];
io.on("connection", (socket) => {
    socket.on("userConnected", (args) => {
        users.push({
            ...args,
            socketId: socket.id
        });
        io.emit("connectedUsers", users);
    });
    socket.on('sendMessage', (message) => {
        const sentToUser = users.find(u => u.userId === message.sentToId);
        if (sentToUser) {
            io.to(sentToUser.socketId).emit('gotNewMessage', message);
        }
    });
    socket.on("seenMessages", (data) => {
        const seenToUser = users.find(u => u.userId === data.seenToId);
        if (seenToUser) {
            io.to(seenToUser.socketId).emit('gotSeenMessages', data);
        }
    });
    socket.on("disconnect", async () => {
        const disconnectedUser = users?.find(user => user.socketId === socket.id);
        users = users.filter(user => user.socketId !== socket.id);
        if (disconnectedUser !== undefined) {
            await updateUserDisconnect(disconnectedUser);
        }
        io.emit("connectedUsers", users);
    });
});
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('DB CONNECTED!');
        httpServer.listen(PORT, () => console.log(`Server is up and runnning on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
