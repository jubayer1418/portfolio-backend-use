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
exports.resetPassword = exports.forgotPassword = exports.getUserForPortfolio = exports.updatePassword = exports.updateProfile = exports.getUser = exports.logout = exports.login = exports.register = void 0;
const cloudinary_1 = require("cloudinary");
const crypto_1 = __importDefault(require("crypto"));
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const error_1 = __importDefault(require("../middlewares/error"));
const userSchema_1 = require("../models/userSchema");
const jwtToken_1 = require("../utils/jwtToken");
const sendEmail_1 = require("../utils/sendEmail");
const config_1 = __importDefault(require("../config"));
exports.register = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new error_1.default("Avatar Required!", 400));
    }
    const { avatar, resume } = req.files;
    //POSTING AVATAR
    const cloudinaryResponseForAvatar = yield cloudinary_1.v2.uploader.upload(avatar.tempFilePath, { folder: "PORTFOLIO AVATAR" });
    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
        console.error("Cloudinary Error:", cloudinaryResponseForAvatar.error || "Unknown Cloudinary error");
        return next(new error_1.default("Failed to upload avatar to Cloudinary", 500));
    }
    //POSTING RESUME
    const cloudinaryResponseForResume = yield cloudinary_1.v2.uploader.upload(resume.tempFilePath, { folder: "PORTFOLIO RESUME" });
    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
        console.error("Cloudinary Error:", cloudinaryResponseForResume.error || "Unknown Cloudinary error");
        return next(new error_1.default("Failed to upload resume to Cloudinary", 500));
    }
    const { fullName, email, phone, aboutMe, password, portfolioURL, githubURL, instagramURL, twitterURL, facebookURL, linkedInURL, } = req.body;
    const user = yield userSchema_1.User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        facebookURL,
        linkedInURL,
        avatar: {
            public_id: cloudinaryResponseForAvatar.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponseForAvatar.secure_url, // Set your cloudinary secure_url here
        },
        resume: {
            public_id: cloudinaryResponseForResume.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponseForResume.secure_url, // Set your cloudinary secure_url here
        },
    });
    (0, jwtToken_1.generateToken)(user, "Registered!", 201, res);
}));
exports.login = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new error_1.default("Provide Email And Password!", 400));
    }
    const user = yield userSchema_1.User.findOne({ email }).select("+password");
    if (!user) {
        return next(new error_1.default("Invalid Email Or Password!", 404));
    }
    const isPasswordMatched = yield user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new error_1.default("Invalid Email Or Password", 401));
    }
    (0, jwtToken_1.generateToken)(user, "Login Successfully!", 200, res);
}));
exports.logout = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(200)
        .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
        .json({
        success: true,
        message: "Logged Out!",
    });
}));
exports.getUser = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.User.findById({ _id: req.user.id });
    res.status(200).json({
        success: true,
        user,
    });
}));
exports.updateProfile = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        portfolioURL: req.body.portfolioURL,
        facebookURL: req.body.facebookURL,
        twitterURL: req.body.twitterURL,
        linkedInURL: req.body.linkedInURL,
    };
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = yield userSchema_1.User.findById({ _id: req.user.id });
        const profileImageId = user.avatar.public_id;
        yield cloudinary_1.v2.uploader.destroy(profileImageId);
        const newProfileImage = yield cloudinary_1.v2.uploader.upload(avatar.tempFilePath, {
            folder: "PORTFOLIO AVATAR",
        });
        newUserData.avatar = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url,
        };
    }
    if (req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = yield userSchema_1.User.findById(req.user.id);
        const resumeFileId = user.resume.public_id;
        if (resumeFileId) {
            yield cloudinary_1.v2.uploader.destroy(resumeFileId);
        }
        const newResume = yield cloudinary_1.v2.uploader.upload(resume.tempFilePath, {
            folder: "PORTFOLIO RESUME",
        });
        newUserData.resume = {
            public_id: newResume.public_id,
            url: newResume.secure_url,
        };
    }
    const user = yield userSchema_1.User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Profile Updated!",
        user,
    });
}));
exports.updatePassword = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = yield userSchema_1.User.findById({ _id: req.user.id }).select("+password");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new error_1.default("Please Fill All Fields.", 400));
    }
    const isPasswordMatched = yield user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
        return next(new error_1.default(401, "Incorrect Current Password!"));
    }
    if (newPassword !== confirmNewPassword) {
        return next(new error_1.default(401, "New Password And Confirm New Password Do Not Match!"));
    }
    user.password = newPassword;
    yield user.save();
    res.status(200).json({
        success: true,
        message: "Password Updated!",
    });
}));
exports.getUserForPortfolio = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = "663296a896e553748ab5b0be";
    const user = yield userSchema_1.User.findById(id);
    res.status(200).json({
        success: true,
        user,
    });
}));
//FORGOT PASSWORD
exports.forgotPassword = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.User.findOne({ email: req.body.email });
    if (!user) {
        return next(new error_1.default("User Not Found!", 404));
    }
    const resetToken = user.getResetPasswordToken();
    yield user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${config_1.default.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
  You've not requested this email then, please ignore it.`;
    try {
        yield (0, sendEmail_1.sendEmail)({
            email: user.email,
            subject: `Personal Portfolio Dashboard Password Recovery`,
            message,
        });
        res.status(201).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new error_1.default(500, error.message));
    }
}));
//RESET PASSWORD
exports.resetPassword = (0, catchAsyncErrors_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.user;
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = yield userSchema_1.User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new error_1.default("Reset password token is invalid or has been expired.", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new error_1.default(401, "Password & Confirm Password do not match"));
    }
    user.password = yield req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    (0, jwtToken_1.generateToken)(user, "Reset Password Successfully!", 200, res);
}));
