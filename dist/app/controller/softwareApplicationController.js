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
exports.getAllApplications = exports.deleteApplication = exports.addNewApplication = void 0;
const cloudinary_1 = require("cloudinary");
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = __importDefault(require("../middlewares/error"));
const softwareApplicationSchema_1 = require("../models/softwareApplicationSchema");
exports.addNewApplication = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new error_1.default("Software Application Icon/Image Required!", 404));
    }
    const { svg } = req.files;
    const { name } = req.body;
    if (!name) {
        return next(new error_1.default("Please Provide Software's Name!", 400));
    }
    const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(svg.tempFilePath, { folder: "PORTFOLIO SOFTWARE APPLICATION IMAGES" });
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new error_1.default("Failed to upload avatar to Cloudinary", 500));
    }
    const softwareApplication = yield softwareApplicationSchema_1.SoftwareApplication.create({
        name,
        svg: {
            public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
        },
    });
    res.status(201).json({
        success: true,
        message: "New Software Application Added!",
        softwareApplication,
    });
}));
exports.deleteApplication = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let softwareApplication = yield softwareApplicationSchema_1.SoftwareApplication.findById(id);
    if (!softwareApplication) {
        return next(new error_1.default("Already Deleted!", 404));
    }
    const softwareApplicationSvgId = softwareApplication.svg.public_id;
    yield cloudinary_1.v2.uploader.destroy(softwareApplicationSvgId);
    yield softwareApplication.deleteOne();
    res.status(200).json({
        success: true,
        message: "Software Application Deleted!",
    });
}));
exports.getAllApplications = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const softwareApplications = yield softwareApplicationSchema_1.SoftwareApplication.find();
    res.status(200).json({
        success: true,
        softwareApplications,
    });
}));
