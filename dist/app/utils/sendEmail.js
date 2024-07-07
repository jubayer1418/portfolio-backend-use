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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.SMPT_HOST || !process.env.SMPT_PORT || !process.env.SMPT_SERVICE || !process.env.SMPT_MAIL || !process.env.SMPT_PASSWORD) {
        throw new Error("Missing SMTP configuration");
    }
    if (!options.email || !options.subject || !options.message) {
        throw new Error("Missing email, subject, or message");
    }
    // create reusable transporter object using the default SMTP transport
    // replace below credentials with your own
    const transporter = (0, nodemailer_1.createTransport)({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your_email', // generated ethereal user
            pass: 'your_password', // generated ethereal password
        },
    });
    // const transporter = nodeMailer.createTransport({
    //   host : process.env.SMPT_HOST ,
    //   port: process.env.SMPT_PORT,
    //   service: process.env.SMPT_SERVICE,
    //   auth: {
    //     user: process.env.SMPT_MAIL,
    //     pass: process.env.SMPT_PASSWORD,
    //   },
    // });
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
