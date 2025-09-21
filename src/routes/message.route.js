import express from "express";
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js";


const router=express.Router()

router.post("/send/:recieverId",sendMessage)
router.get("/contacts",getAllContacts)
router.get("/chats",getChatPartners)
router.get("/:messageId",getMessagesByUserId)
export {router as messageRoutes}