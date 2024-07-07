import express from "express";
import { addNewSkill, deleteSkill, updateSkill, getAllSkills } from "../controller/skillController";
import { isAuthenticated } from "../middlewares/auth";


const router = express.Router();

router.post("/add", isAuthenticated, addNewSkill);
router.delete("/delete/:id", isAuthenticated, deleteSkill);
router.put("/update/:id", isAuthenticated, updateSkill);
router.get("/getall", getAllSkills);

export default router;
