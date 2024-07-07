"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timelineController_1 = require("../controller/timelineController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/add", auth_1.isAuthenticated, timelineController_1.postTimeline);
router.delete("/delete/:id", auth_1.isAuthenticated, timelineController_1.deleteTimeline);
router.get("/getall", timelineController_1.getAllTimelines);
exports.default = router;
