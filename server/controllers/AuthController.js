import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import dotenv from 'dotenv';
import { genSalt, hash, compare } from 'bcrypt';
import {renameSync,unlinkSync} from 'fs';

dotenv.config();

const maxAge = 3 * 24 * 60 * 60; // 3 days

// Function to create JWT token
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

// Signup function
export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const user = await User.create({ email, password: hashedPassword });

        res.cookie("jwt", createToken(email, user._id), {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: "None",
        });

        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User with the given email not found." });
        }

        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(400).json({ message: "Password is incorrect." });
        }

        res.cookie("jwt", createToken(email, user._id), {
            httpOnly: true,
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get User Info function
export const getUserInfo = async (req, res) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with the given ID not found.");
        }

        return res.status(200).send({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        });
    } catch (error) {
        console.error("Get user info error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Profile function
export const updateProfile = async (req, res,next) => {
    try {
        const {userId} = req;
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("First name, last name, and color are required.");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup:true
            },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).send("User not found.");
        }

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const addProfileImage = async (req, res,next) => {
    try {
     
        if(!req.file){
           return res.status(400).send("File is required")
        }
        const date =Date.now();
        let fileName="uploads/profiles"+data+reqest.file.originalname; 
        renameSync(request.file.path,fileName)
        const updatedUser=await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true});


        return res.status(200).json({
          
            image: updatedUser.image,
            
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const removeProfileImage = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("First name, last name, and color are required.");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true
            },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).send("User not found.");
        }

        return res.status(200).json({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).send("Internal Server Error");
    }
};