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

    const sendMessage=async(message)=>{
        const senderSocketId=userSocketMap.get(message.sender);
        const recipientSocketId=userSocketMap.get(message.recipient);
        const createdMessage=await Message.create(Message)

        const messageData=await Message.findById(createdMessage._id).populate("sender","id email firstName lastName image color")
        .populate("recipient","id email firstName lastName image color");
        if(recipientSocketId){
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("recieveMessage",messageData);
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
