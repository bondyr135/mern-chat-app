const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require('./routes/messagesRoute');
const app = express();
const socket = require('socket.io');
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},)
  .then(() => {
    console.log(`DB connected successfully`)
  })
  .catch(e => {
    console.log(`ERROR MESSAGE: ${e.message}`)
  })

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`)
});

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on("connection", socket => {
  global.chatSocket = socket;
  socket.on("add-user", userId => {
    global.onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", data => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  })
})