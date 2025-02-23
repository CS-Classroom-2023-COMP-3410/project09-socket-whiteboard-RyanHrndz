const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let boardState = []; // Store drawn strokes

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Send existing board state to new clients
    socket.emit("load-board", boardState);

    // Listen for drawing events
    socket.on("draw", (data) => {
        boardState.push(data);
        socket.broadcast.emit("draw", data);
    });

    // Listen for clear event
    socket.on("clear-board", () => {
        boardState = [];
        io.emit("clear-board");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
