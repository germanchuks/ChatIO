const express = require("express");
const { db } = require('./db/db');
const cookieParser = require('cookie-parser')
const { readdirSync } = require('fs')
const { Server } = require("socket.io");
const http = require("http");

require('dotenv').config();
const PORT = process.env.PORT || 5004;

const app = express();
const cors = require("cors");
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

app.use(express.static("build"));
app.use(express.json())

// Allow cookies
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

// Map and use all available routes
readdirSync('./routes').map((route) => app.use(require('./routes/' + route)))


// Import and use the socket events
require('./sockets/socketEvents')(io);


const runServer = () => {
    db()
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

runServer();