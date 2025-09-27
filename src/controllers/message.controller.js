import { Message } from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllContacts = async (req, res) => {

    const loggedInUserId=req.user._id;
    const filteredUsers=await User.find({_id:{$ne:loggedInUserId}})
  try {
    const messages = await Message.find({});
    if (!messages)
      return res.status(400).json({ message: "No any Contacts found." });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getting all the Contacts", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getAllChats=async(req,res)=>{}
export const sendMessage=async(req,res)=>{}
export const getMessagesByUserId=async(req,res)=>{}
export const getChatPartners=async(req,res)=>{

}
