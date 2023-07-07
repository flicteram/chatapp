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
            const sentToUsers = users.reduce((acc, currentVal) => {
                if (message.sentToIds.includes(currentVal.userId)) {
                    return [...acc, currentVal.socketId];
                }
                return acc;
            }, []);
            if (sentToUsers.length) {
                io.to(sentToUsers).emit('gotNewMessage', message);
            }
        });
        socket.on("seenMessages", (data) => {
            const seenToIds = users.reduce((acc, currentVal) => {
                if (data.seenToId.includes(currentVal.userId)) {
                    return [...acc, currentVal.socketId];
                }
                return acc;
            }, []);
            if (seenToIds.length) {
                io.to(seenToIds).emit('gotSeenMessages', data);
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
