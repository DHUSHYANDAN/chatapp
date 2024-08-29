import {Router} from 'express';
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import { getMessages } from '../controllers/MessagesControllers.js';

const messagesRoutes=Router();

messagesRoutes.post("/get-messages",verifyToken,getMessages)

export default  messagesRoutes;