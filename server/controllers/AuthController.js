import jwt from 'jsonwebtoken'; 
import User from '../models/UserModel.js';
import dotenv from 'dotenv';   
import { genSalt, hash, compare } from 'bcrypt';

dotenv.config();

const maxAge = 3 * 24 * 60 * 60; 

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

        const user = await User.create({ email, password });  

        res.cookie("jwt", createToken(email, user._id), { // Change user.id to user._id
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: "None",
        });

        return res.status(201).json({
            user: {
                id: user._id, // Change user.id to user._id
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } catch (error) {  
        console.error("Signup error:", error);  
        return res.status(500).json({ message: "Internal Server Error" });  
    }  
};

export const login = async (req, res, next) => {  
    try {  
        const { email, password } = req.body;  

        if (!email || !password) {  
            return res.status(400).json({ message: "Email and Password are required." });  
        }  

        const user = await User.findOne({ email});  
        if (!user) {  
            return res.status(404).send({ message: "user with the given email not found." });  
        }  
       const auth=await compare(password,user.password)
       if(!auth){
        return res.status(400).json({ message: "password is incorrect." });  
       }
        res.cookie("jwt", createToken(email, user._id), { // Change user.id to user._id
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            user: {
                id: user._id, // Change user.id to user._id
                email: user.email,
                profileSetup: user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color,
            }
        });
    } catch (error) {  
        console.error("Signup error:", error);  
        return res.status(500).json({ message: "Internal Server Error" });  
    }  
};

export const getUserInfo=async (req, res, next) => {  
    try {  
         
       

        // return res.status(200).json({
        //     user: {
        //         id: user._id, // Change user.id to user._id
        //         email: user.email,
        //         profileSetup: user.profileSetup,
        //         firstName:user.firstName,
        //         lastName:user.lastName,
        //         image:user.image,
        //         color:user.color,
        //     }
        // });
    } catch (error) {  
        console.error("Signup error:", error);  
        return res.status(500).json({ message: "Internal Server Error" });  
    }  
};
