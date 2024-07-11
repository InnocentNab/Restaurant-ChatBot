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

  let userArray = [];
  let selectedFood = [];
  let foodCheckout = [];
  socket.on("message", (msg) => {
    // console.log(msg);
    var botResponse = ``;
    if (msg == 1) {
      // console.log(`Menu`);
      botResponse = `Menu: 11. Pizza 32. Burger 43. Pasta 54. Coke`;
      userArray.push({ user: msg });
      console.log(userArray);
    } else if (msg == 11) {
      console.log(userArray.length);
      if (userArray.length < 1) {
        botResponse = `wrong selection, please select from the list provided`;
      } else {
        botResponse = `Pizza Selected`;
        selectedFood.push(botResponse);

        // console.log(selectedFood, food[0], foodCheckout);
      }
    } else if (msg == 32) {
      console.log(userArray.length);
      if (userArray.length < 1) {
        botResponse = `wrong selection, please select from the list provided`;
      } else {
        botResponse = `Burger Selected`;
        selectedFood.push(botResponse);
      }
    } else if (msg == 43) {
      console.log(userArray.length);
      if (userArray.length < 1) {
        botResponse = `wrong selection, please select from the list provided`;
      } else {
        botResponse = `Pasta Selected`;
        selectedFood.push(botResponse);
      }
    } else if (msg == 54) {
      console.log(userArray.length);
      if (userArray.length < 1) {
        botResponse = `wrong selection, please select from the list provided`;
      } else {
        botResponse = `Coke Selected`;
        selectedFood.push(botResponse);
      }
    } else if (msg == 98) {
      if (userArray.length < 1) {
        botResponse = `order has not been placed`;
      } else {
        botResponse = `Order History ${foodCheckout}`;
      }
    } else if (msg == 99) {
      botResponse = `order placed`;
    } else if (msg == 97) {
      if (userArray.length < 1) {
        botResponse = `order has not been placed`;
      } else {
        const food = selectedFood[0].split(" ");
        foodCheckout.push(food[0]);
        botResponse = `Your current order is ${foodCheckout}`;
      }
    } else if (msg == 0) {
      botResponse = "Order cancelled";
    } else {
      ("No Order Placed, Please Select From The Menu.");
    }
    // console.log(botResponse);
    socket.emit("bot message", botResponse);
  });
});

server.listen(3000, () => {
  console.log("Server running at port 3000");
});
