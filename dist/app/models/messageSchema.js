"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    senderName: {
        type: String,
        minLength: [2, "Name Must Contain At Least 2 Characters!"],
    },
    subject: {
        type: String,
        minLength: [2, "Subject Must Contain At Least 2 Characters!"],
    },
    message: {
        type: String,
        minLength: [2, "Message Must Contain At Least 2 Characters!"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.Message = mongoose_1.default.model("Message", messageSchema);
