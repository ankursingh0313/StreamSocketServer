const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let messages = []; // Store message history

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing messages to the new client
  socket.emit("messageHistory", messages);

  socket.on("message", (msg) => {
    const data = { id: socket.id, message: msg };

    // Save to message history
    messages.push(data);

    // Keep only the last 20 messages
    if (messages.length > 20) {
      messages = messages.slice(-20);
    }

    // Emit message to all connected clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
