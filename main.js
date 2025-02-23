import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("color-picker");
const clearBtn = document.getElementById("clear-btn");

let drawing = false;
let color = "#000000"; // Default black

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

// Update color when user picks a new one
colorPicker.addEventListener("input", (e) => {
    color = e.target.value;
});

// Mouse event listeners for drawing
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath(); // Reset path after stroke
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    const data = { x, y, color };
    socket.emit("draw", data);
});

// Listen for draw events from the server
socket.on("draw", (data) => {
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x, data.y, 5, 5); // Small square strokes
});

// Handle clear board
clearBtn.addEventListener("click", () => {
    socket.emit("clear-board");
});

socket.on("clear-board", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Load existing board state for new users
socket.on("load-board", (board) => {
    board.forEach((data) => {
        ctx.fillStyle = data.color;
        ctx.fillRect(data.x, data.y, 5, 5);
    });
});
