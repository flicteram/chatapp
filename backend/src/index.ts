import 'express-async-errors';
import express from 'express';
import connectDB from './db/index.js'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import registerRouter from './routes/register.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import refreshRouter from './routes/refresh.js'
import logoutRouter from './routes/logout.js'
import handleErrors from './middleware/handle-errors.js';
import verifyJWT from './middleware/verifyJWT.js'
import conversation from './routes/conversation.js'
import conversations from './routes/conversations.js'
import { updateUserDisconnect } from './controllers/users.js'
import { Server } from 'socket.io';
import cors from 'cors'
import { createServer } from 'http'
import ConnectedUser from './interfaces/connectedUser.js'

dotenv.config()
const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })
// middleware

app.use(cors({
  credentials: true,
  origin: '*'
}));
app.use(express.json())
app.use(cookieParser())
// routes
app.use('/register', registerRouter)
app.use('/auth', authRouter)
app.use('/logout', logoutRouter)
app.use('/refresh', refreshRouter)

app.use(verifyJWT)
app.use('/users', usersRouter)
app.use('/conversation', conversation)
app.use('/conversations', conversations)

app.use(handleErrors)
// start

let users: ConnectedUser[] = [];
io.on("connection", (socket) => {
  socket.on("userConnected", (args) => {
    users.push({
      ...args,
      socketId: socket.id
    })
    io.emit("connectedUsers", users)
  })
  socket.on('sendMessage', (message) => {
    const sentToUser = users.find(u => u.userId === message.sentToId)
    if (sentToUser) {
      io.to(sentToUser.socketId).emit('gotNewMessage', message)
    }
  })
  socket.on("seenMessages", (data) => {
    const seenToUser = users.find(u => u.userId === data.seenToId)
    if (seenToUser) {
      io.to(seenToUser.socketId).emit('gotSeenMessages', data)
    }
  })
  socket.on("disconnect", async () => {
    const disconnectedUser = users?.find(user => user.socketId === socket.id)
    users = users.filter(user => user.socketId !== socket.id)
    if (disconnectedUser !== undefined) {
      await updateUserDisconnect(disconnectedUser)
    }
    io.emit("connectedUsers", users)
  })
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    console.log('DB CONNECTED!');
    httpServer.listen(PORT, () => console.log(`Server is up and runnning on port ${PORT}`));
  } catch (e) {
    console.log(e)
  }
}

start()