import Message from "../models/MessagesModel.js";
import { mkdirSync } from 'fs';

export const getMessages = async (req, res,next) => {
    try {
        const user1 =req.userId;
        const user2 =req.body.id;
        
        if (user1 || !user2){
        return res.status(400).send("Both user Id's are required.");
        }


        
        const messages= await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1},
                                
            ],
        }).sort({timestamp:1});
        return res.status(200).json({messages});

    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const uploadFile = async (request, response, next) => {
    try {
      if (!request.file) {
        return response.status(400).send({ message: "File is required" });
      }
  
      const date = Date.now();
      const fileDir = join('uploads', 'files', `${date}`);
      const fileName = `${fileDir}/${ request.file.originalname}`;
  
      mkdirSync(fileDir, { recursive: true });
      renameSync(request.file.path, fileName);
  
      return response.status(200).json({ filePath: fileName });
    } catch (error) {
      console.error(error);
      return response.status(500).send({ message: "Server Error" });
    }
  };