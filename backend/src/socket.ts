
import { updateUserDisconnect } from './controllers/users.js'
import ConnectedUser from './interfaces/connectedUser.js'
import { Server } from 'socket.io';

export default function handleWebSocket(io:Server){
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
}