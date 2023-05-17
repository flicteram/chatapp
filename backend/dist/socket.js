import { updateUserDisconnect } from './controllers/users.js';
export default function handleWebSocket(io) {
    let users = [];
    io.on("connection", (socket) => {
        socket.on("userConnected", (args) => {
            const user = {
                ...args,
                socketId: socket.id
            };
            users.push(user);
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
            let disconnectedUser = {};
            const connectedUsers = [];
            users.forEach((user) => {
                if (user.socketId === socket.id) {
                    disconnectedUser = user;
                }
                else {
                    connectedUsers.push(user);
                }
            });
            if (disconnectedUser !== undefined) {
                await updateUserDisconnect(disconnectedUser);
            }
            users = connectedUsers;
            io.emit("connectedUsers", users);
        });
    });
}
