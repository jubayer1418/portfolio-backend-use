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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Name Required!"],
    },
    email: {
        type: String,
        required: [true, "Email Required!"],
    },
    phone: {
        type: String,
        required: [true, "Phone Required!"],
    },
    aboutMe: {
        type: String,
        required: [true, "About Me Section Is Required!"],
    },
    password: {
        type: String,
        required: [true, "Password Required!"],
        minLength: [8, "Password Must Contain At Least 8 Characters!"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    portfolioURL: {
        type: String,
        required: [true, "Portfolio URL Required!"],
    },
    githubURL: {
        type: String,
    },
    instagramURL: {
        type: String,
    },
    twitterURL: {
        type: String,
    },
    linkedInURL: {
        type: String,
    },
    facebookURL: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
    });
});
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, this.password);
    });
};
userSchema.methods.generateJsonWebToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, config_1.default.secret, {
        expiresIn: config_1.default.jwtexpire,
    });
};
//Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    //Hashing and Adding Reset Password Token To UserSchema
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    //Setting Reset Password Token Expiry Time
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
exports.User = mongoose_1.default.model("User", userSchema);
