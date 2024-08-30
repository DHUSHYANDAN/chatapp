import express from "express";  
import dotenv from "dotenv";  
import cors from "cors";  
import cookieParser from "cookie-parser";  
import mongoose from "mongoose";  
import authRoutes from "./routes/AuthRouters.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";


dotenv.config(); 

const app = express();  

app.use(  
  cors({  
    origin: process.env.ORIGIN,  
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],  
    credentials: true,  
  })  
);  

app.use("/uploads/profiles",express.static("uploads/profiles"));

app.use("/uploads/files",express.static("uploads/files"));

app.use(cookieParser());  
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts",contactsRoutes);
app.use("/api/messages",messagesRoutes)


const port = process.env.PORT || 3001; 
const databaseURL = process.env.DATABASE_URL;




mongoose.connect(databaseURL)  
  .then(() => console.log("DB Connection Successful"))  
  .catch(err => console.error("DB Connection Error:", err));

const server = app.listen(port, () => {  
  console.log(`Server is running at http://localhost:${port}`);  
});
setupSocket(server);