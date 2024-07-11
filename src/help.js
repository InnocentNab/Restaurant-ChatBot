// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("user message", (msg) => {
    console.log("User message:", msg);

    // Simple bot logic
    let botResponse = "";
    if (msg.toLowerCase() === "hello") {
      botResponse = `
                <ul>
                    <li>Hello! How can I assist you today?</li>
                </ul>
            `;
    } else if (msg.toLowerCase() === "help") {
      botResponse = `
                <ul>
                    <li>Here are some things you can ask me:</li>
                    <li>- What is the weather like?</li>
                    <li>- Tell me a joke.</li>
                    <li>- What time is it?</li>
                </ul>
            `;
    } else {
      botResponse = `
                <ul>
                    <li>I'm sorry, I didn't understand that.</li>
                    <li>Type "help" for a list of things you can ask me.</li>
                </ul>
            `;
    }

    socket.emit("bot response", botResponse);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
