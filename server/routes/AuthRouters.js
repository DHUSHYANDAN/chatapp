import { Router } from 'express';  
import { signup } from '../controllers/AuthController.js'; 

const authRoutes = Router();  

authRoutes.post('/signup', signup);

export default authRoutes;