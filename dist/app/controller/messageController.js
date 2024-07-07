"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.deleteMessage = exports.sendMessage = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = __importDefault(require("../middlewares/error"));
const messageSchema_1 = require("../models/messageSchema");
exports.sendMessage = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderName, subject, message } = req.body;
    if (!senderName || !subject || !message) {
        return next(new error_1.default("Please Fill Full Form!", 400));
    }
    const data = yield messageSchema_1.Message.create({ senderName, subject, message });
    res.status(201).json({
        success: true,
        message: "Message Sent",
        data,
    });
}));
exports.deleteMessage = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const message = yield messageSchema_1.Message.findById(id);
    if (!message) {
        return next(new error_1.default("Message Already Deleted!", 400));
    }
    yield message.deleteOne();
    res.status(201).json({
        success: true,
        message: "Message Deleted",
    });
}));
exports.getAllMessages = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield messageSchema_1.Message.find();
    res.status(201).json({
        success: true,
        messages,
    });
}));
