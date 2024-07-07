"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    res
        .status(statusCode)
        .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    })
        .json({
        success: true,
        message,
        user,
        token,
    });
};
exports.generateToken = generateToken;
