const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const ImageRouther = require('./route');
const personal = require('./route');
const career = require('./route');
const social = require('./route');



// Initialize App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth',ImageRouther);
app.use('/api/auth',personal);


// MongoDB Connection
mongoose
  .connect("mongodb+srv://ravipratihast71:LCtQ1SB82Dr5ITu3@cluster0.hkwcuwh.mongodb.net/metrimonial:Db")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// MongoDB Schema and Model
const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// API Endpoint to Fetch Messages
app.get("/messages", async (req, res) => {
  const { sender, receiver } = req.query;
  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});

// Real-time Communication with Socket.IO
io.on("connection", (socket) => {
  console.log("Online:", socket.id);

  // Listen for Sending Messages
  socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;

    // Check for duplicate messages by comparing timestamps
    const isDuplicate = await Message.exists({
      sender,
      receiver,
      message,
      timestamp: { $gte: new Date(Date.now() - 500) }, // Duplicate if within 500ms
    });

    if (!isDuplicate) {
      // Save message to MongoDB
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      // Emit the message to the receiver
      io.emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the Server
const PORT = process.env.PORT|| 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));