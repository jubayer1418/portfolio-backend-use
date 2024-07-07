import express from "express";
import { sendMessage, deleteMessage, getAllMessages } from "../controller/messageController";
import { isAuthenticated } from "../middlewares/auth";


const router = express.Router();

router.post("/send", sendMessage);
router.delete("/delete/:id", isAuthenticated, deleteMessage);
router.get("/getall", isAuthenticated, getAllMessages);

export default router;
