"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const softwareApplicationController_1 = require("../controller/softwareApplicationController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/add", auth_1.isAuthenticated, softwareApplicationController_1.addNewApplication);
router.delete("/delete/:id", auth_1.isAuthenticated, softwareApplicationController_1.deleteApplication);
router.get("/getall", softwareApplicationController_1.getAllApplications);
exports.default = router;
