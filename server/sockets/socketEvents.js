
const userSocketMap = new Map();

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Connected", socket.id);

        // Handle join event
        socket.on("join", ({ chatID, userID }) => {
            socket.join(chatID);
            userSocketMap.set(userID, socket.id);

            socket.userID = userID;
            socket.chatID = chatID;

            // Send a welcome message to the socket
            socket.emit("message", {
                user: "admin",
                text: `Welcome to the room`,
            });
            console.log(`A user joined room: ${chatID}`);

            // socket.to(chatID).emit('new_user', { userID });

            io.in(chatID).emit('get_current_users');
            sendCurrentUsers(chatID);
        });

        socket.on('get_current_users', () => {
            sendCurrentUsers(socket.chatID);
        });

        // Leave chat room
        socket.on('leave_chat', (chatID) => {
            socket.leave(chatID);
            console.log(`User left room: ${chatID}`);
            userSocketMap.delete(socket.userID);
            if (socket.chatID) {
                socket.to(socket.chatID).emit('user_left', { userID: socket.userID, socketID: socket.id });
                sendCurrentUsers(socket.chatID);
            }
        });

        // Handle chat event
        socket.on("send_chat", ({ data, chatID }) => {
            socket.to(chatID).emit("receive_chat", data);
        });

        // Handle the socket.io disconnect event
        socket.on("disconnect", () => {
            console.log("User left", socket.id);

        });

        const sendCurrentUsers = (chatID) => {
            if (chatID) {
                const usersInRoom = [];
                for (const [userID, socketID] of userSocketMap.entries()) {
                    if (io.sockets.sockets.get(socketID)?.rooms.has(chatID)) {
                        usersInRoom.push({ userID, socketID });
                    }
                }
                io.in(chatID).emit('current_users', usersInRoom);
            }
        };
    });
};