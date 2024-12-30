const mongoose = require('mongoose');
// Message Schema
const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Message = mongoose.model('Message', messageSchema);