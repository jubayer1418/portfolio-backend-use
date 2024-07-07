import express from "express";
import { register } from "module";
import { login, getUser, logout, getUserForPortfolio, updatePassword, updateProfile, forgotPassword, resetPassword } from "../controller/userController";
import { isAuthenticated } from "../middlewares/auth";


const router = express.Router();

// router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);
router.get("/portfolio/me", getUserForPortfolio);
router.put("/password/update", isAuthenticated, updatePassword);
router.put("/me/profile/update", isAuthenticated, updateProfile);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
