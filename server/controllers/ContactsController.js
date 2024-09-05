
import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";


export const searchContacts = async (req, res,next) => {
    try {
        const {searchTerm } =req.body;
        if (searchTerm ===undefined || searchTerm===null){
        return res.status(400).send("SearchTerm is required.");
        }

        const sanitizedSearchTerm=searchTerm.replace(/[.**?^${}|[\]\\]/g,"\\$&");

        const regex=new RegExp(sanitizedSearchTerm,"i");
        const contacts=await User.find({
            $and: [{_id:{$ne:req.userId}},
                {
                    $or:[{firstName: regex}, {lastNmae:regex},{email:regex}],
                },
            ],
        });

        return res.status(200).json({contacts});

    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const getContactsForDMList = async (req, res, next) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ]);

        return res.status(200).json({ contacts });

    } catch (error) {
        console.error("DM List error:", error);
        return res.status(500).send("Internal Server Error");
    }
};



export const getAllContacts = async (request, response, next) => {
    try {
      const users = await User.find(
        { _id: { $ne: request.userId } },
        "firstName lastName _id email"    
      );
  
      const contacts = users.map((user) => ({
        label: user.firstName ? `${user.firstName} ${user.lastName}`:
        user.email,
      }));
  
      return response.status(200).json(contacts);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Server Error" });
    }
  };
  