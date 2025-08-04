module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room based on user ID
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Send and receive messages
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, content } = data;
        
        // Save message to database
        const Message = require('../models/Message');
        const newMessage = new Message({
          sender,
          receiver,
          content
        });
        
        await newMessage.save();

        // Populate sender info
        const message = await Message.findById(newMessage._id)
          .populate('sender', 'username profileImage');

        // Emit to sender and receiver
        io.to(sender).emit('newMessage', message);
        io.to(receiver).emit('newMessage', message);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};