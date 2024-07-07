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
exports.getAllTimelines = exports.deleteTimeline = exports.postTimeline = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = __importDefault(require("../middlewares/error"));
const timelineSchema_1 = require("../models/timelineSchema");
exports.postTimeline = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, from, to } = req.body;
    const newTimeline = yield timelineSchema_1.Timeline.create({
        title,
        description,
        timeline: { from, to },
    });
    res.status(200).json({
        success: true,
        message: "Timeline Added!",
        newTimeline,
    });
}));
exports.deleteTimeline = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let timeline = yield timelineSchema_1.Timeline.findById(id);
    if (!timeline) {
        return next(new error_1.default("Timeline not found", 404));
    }
    yield timeline.deleteOne();
    res.status(200).json({
        success: true,
        message: "Timeline Deleted!",
    });
}));
exports.getAllTimelines = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const timelines = yield timelineSchema_1.Timeline.find();
    res.status(200).json({
        success: true,
        timelines,
    });
}));
