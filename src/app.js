import express from "express";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import http from "http";
import { Server } from "socket.io";

// creating a server from express
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// mount/bind http server on socket.io
const server = http.createServer(app);
const foods = ["Pizza", "Burger", "Pasta", "Sushi", "Salad"];

const getBotResponse = (msg) => {
  const response = msg.toLowerCase();
  if (response.includes(1)) {
    return foods;
  } else if (response.includes(98)) {
    return ``;
  } else if (response.includes(99)) {
    return `order placed`;
  } else if (response.includes(97)) {
    return "Sorry, I did not understand that.";
  } else if (response.includes(0)) {
    return "Order cancelled";
  } else {
    return "No order to place   ";
  }
};

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const connections = {};

io.on("connection", (socket) => {
  console.log("A customer connected", socket.id);
  const token = socket.handshake.auth.token;
  console.log("token", token);

  connections[socket.id] = socket;
  socket.on("disconnect", () => {
    console.log("A customer disconnected", socket.id);
  });

  socket.on("message", (msg) => {
    const botResponse = getBotResponse(msg);
    socket.emit("bot message", botResponse);
  });
});

server.listen(3000, () => {
  console.log("Server running at port 3000");
});
