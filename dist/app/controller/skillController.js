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
exports.getAllSkills = exports.updateSkill = exports.deleteSkill = exports.addNewSkill = void 0;
const cloudinary_1 = require("cloudinary");
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = __importDefault(require("../middlewares/error"));
const skillSchema_1 = require("../models/skillSchema");
exports.addNewSkill = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new error_1.default("Image For Skill Required!", 404));
    }
    const { svg } = req.files;
    const { title, proficiency } = req.body;
    if (!title || !proficiency) {
        return next(new error_1.default("Please Fill Full Form!", 400));
    }
    const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(svg.tempFilePath, { folder: "PORTFOLIO SKILL IMAGES" });
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new error_1.default("Failed to upload avatar to Cloudinary", 500));
    }
    const skill = yield skillSchema_1.Skill.create({
        title,
        proficiency,
        svg: {
            public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
        },
    });
    res.status(201).json({
        success: true,
        message: "New Skill Added",
        skill,
    });
}));
exports.deleteSkill = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let skill = yield skillSchema_1.Skill.findById(id);
    if (!skill) {
        return next(new error_1.default("Already Deleted!", 404));
    }
    const skillSvgId = skill.svg.public_id;
    yield cloudinary_1.v2.uploader.destroy(skillSvgId);
    yield skill.deleteOne();
    res.status(200).json({
        success: true,
        message: "Skill Deleted!",
    });
}));
exports.updateSkill = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let skill = yield skillSchema_1.Skill.findById(id);
    if (!skill) {
        return next(new error_1.default("Skill not found!", 404));
    }
    const { proficiency } = req.body;
    skill = yield skillSchema_1.Skill.findByIdAndUpdate(id, { proficiency }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Skill Updated!",
        skill,
    });
}));
exports.getAllSkills = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const skills = yield skillSchema_1.Skill.find();
    res.status(200).json({
        success: true,
        skills,
    });
}));
