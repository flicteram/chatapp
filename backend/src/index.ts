import 'express-async-errors';
import express from 'express';
import connectDB from './db/index.js'
import * as dotenv from 'dotenv'
import publicRoutes from './routes/publicRoutes.js';
import privateRoutes from './routes/privateRoutes.js';
import cookieParser from 'cookie-parser'
import handleErrors from './middleware/handle-errors.js';
import { updateUserDisconnect } from './controllers/users.js'
import { Server } from 'socket.io';
import cors from 'cors'
import { createServer } from 'http'
import ConnectedUser from './interfaces/connectedUser.js'
// import handleCors from './middleware/handle-errors.js'

dotenv.config()
const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })
// middleware
// app.use(handleCors)
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(express.json())
app.use(cookieParser())
// routes

publicRoutes(app)
privateRoutes(app)

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