import jwt from 'jsonwebtoken'; 
import User from '../models/UserModel.js';
import dotenv from 'dotenv';   

dotenv.config();

const maxAge = 3 * 24 * 60 * 60 * 1000; 

const createToken = (email, userId) => {  
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {  
        expiresIn: maxAge,  
    });  
};  

export const signup = async (req, res, next) => {  
    try {  
        const { email, password } = req.body;  

        if (!email || !password) {  
            return res.status(400).json({ message: "Email and Password are required." });  
        }  

        const user= await User.create({email,password});  

         response.cookie("jwt",createToken(email,user,id),{
            maxAge,
            secure:true,
            sameSite:"None",
         });
         return res.status(201).json({user:{
            id:user.id,
            email:user.email,
            // firstName:user.firstName,
            // lastName:user.lastName,
            // image:user.image,
            profileSetup:user.profileSetup,
         },
        })
     
    } catch (error) {  
        console.error("Signup error:", error);  
        return res.status(500).json({ message: "Internal Server Error" });  
    }  
};