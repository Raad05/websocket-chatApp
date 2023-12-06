// imports
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server running on port: ${port}`)
);
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "public")));

let socketsConected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log("Socket connected", socket.id);
  socketsConected.add(socket.id);
  io.emit("total-clients", socketsConected.size);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    io.emit("total-clients", socketsConected.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
