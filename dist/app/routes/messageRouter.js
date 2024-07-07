"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controller/messageController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/send", messageController_1.sendMessage);
router.delete("/delete/:id", auth_1.isAuthenticated, messageController_1.deleteMessage);
router.get("/getall", auth_1.isAuthenticated, messageController_1.getAllMessages);
exports.default = router;
