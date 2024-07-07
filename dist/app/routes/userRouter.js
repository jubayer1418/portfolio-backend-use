"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// router.post("/register", register);
router.post("/login", userController_1.login);
router.get("/me", auth_1.isAuthenticated, userController_1.getUser);
router.get("/logout", auth_1.isAuthenticated, userController_1.logout);
router.get("/portfolio/me", userController_1.getUserForPortfolio);
router.put("/password/update", auth_1.isAuthenticated, userController_1.updatePassword);
router.put("/me/profile/update", auth_1.isAuthenticated, userController_1.updateProfile);
router.post("/password/forgot", userController_1.forgotPassword);
router.put("/password/reset/:token", userController_1.resetPassword);
exports.default = router;
