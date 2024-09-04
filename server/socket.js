import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,  // Set this to true
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        try {
          const senderSocketId = userSocketMap.get(message.sender);
          const recipientSocketId = userSocketMap.get(message.recipient);
      
          // Create a new message in the database
          const createdMessage = await Message.create(message);
      
          // Fetch the newly created message with populated sender and recipient details
          const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");
      
          // Emit the message to the recipient's socket if they are connected
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
          }
      
          // Emit the message to the sender's socket as well
          if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
          }
        } catch (err) {
          console.error("Error sending message:", err);
        }
      };
      
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection.");
        }
        socket.on("sendMessage",sendMessage)
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
