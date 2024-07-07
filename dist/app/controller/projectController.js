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
exports.getSingleProject = exports.getAllProjects = exports.deleteProject = exports.updateProject = exports.addNewProject = void 0;
const cloudinary_1 = require("cloudinary");
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = __importDefault(require("../middlewares/error"));
const projectSchema_1 = require("../models/projectSchema");
exports.addNewProject = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new error_1.default("Project Banner Image Required!", 404));
    }
    const { projectBanner } = req.files;
    const { title, description, gitFRepoLink, gitERepoLink, projectLink, stack, technologies, deployed, } = req.body;
    if (!title ||
        !description ||
        !gitFRepoLink ||
        !gitERepoLink ||
        !projectLink ||
        !stack ||
        !technologies ||
        !deployed) {
        return next(new error_1.default("Please Provide All Details!", 400));
    }
    const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(projectBanner.tempFilePath, { folder: "PORTFOLIO PROJECT IMAGES" });
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new error_1.default("Failed to upload avatar to Cloudinary", 500));
    }
    const project = yield projectSchema_1.Project.create({
        title,
        description,
        gitFRepoLink,
        gitERepoLink,
        projectLink,
        stack,
        technologies,
        deployed,
        projectBanner: {
            public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
        },
    });
    res.status(201).json({
        success: true,
        message: "New Project Added!",
        project,
    });
}));
exports.updateProject = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newProjectData = {
        title: req.body.title,
        description: req.body.description,
        stack: req.body.stack,
        technologies: req.body.technologies,
        deployed: req.body.deployed,
        projectLink: req.body.projectLink,
        gitFRepoLink: req.body.gitFRepoLink,
        gitERepoLink: req.body.gitERepoLink,
    };
    if (req.files && req.files.projectBanner) {
        const projectBanner = req.files.projectBanner;
        const project = yield projectSchema_1.Project.findById(req.params.id);
        const projectImageId = project.projectBanner.public_id;
        yield cloudinary_1.v2.uploader.destroy(projectImageId);
        const newProjectImage = yield cloudinary_1.v2.uploader.upload(projectBanner.tempFilePath, {
            folder: "PORTFOLIO PROJECT IMAGES",
        });
        newProjectData.projectBanner = {
            public_id: newProjectImage.public_id,
            url: newProjectImage.secure_url,
        };
    }
    const project = yield projectSchema_1.Project.findByIdAndUpdate(req.params.id, newProjectData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Project Updated!",
        project,
    });
}));
exports.deleteProject = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const project = yield projectSchema_1.Project.findById(id);
    if (!project) {
        return next(new error_1.default("Already Deleted!", 404));
    }
    const projectImageId = project.projectBanner.public_id;
    yield cloudinary_1.v2.uploader.destroy(projectImageId);
    yield project.deleteOne();
    res.status(200).json({
        success: true,
        message: "Project Deleted!",
    });
}));
exports.getAllProjects = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield projectSchema_1.Project.find();
    res.status(200).json({
        success: true,
        projects,
    });
}));
exports.getSingleProject = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield projectSchema_1.Project.findById(id);
        res.status(200).json({
            success: true,
            project,
        });
    }
    catch (error) {
        res.status(400).json({
            error,
        });
    }
}));
