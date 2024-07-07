"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./app/config"));
const userRouter_1 = __importDefault(require("./app/routes/userRouter"));
const timelineRouter_1 = __importDefault(require("./app/routes/timelineRouter"));
const messageRouter_1 = __importDefault(require("./app/routes/messageRouter"));
const skillRouter_1 = __importDefault(require("./app/routes/skillRouter"));
const projectRouter_1 = __importDefault(require("./app/routes/projectRouter"));
const softwareApplicationRouter_1 = __importDefault(require("./app/routes/softwareApplicationRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [config_1.default.PORTFOLIO_URL, config_1.default.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use("/api/v1/user", userRouter_1.default);
app.use("/api/v1/timeline", timelineRouter_1.default);
app.use("/api/v1/message", messageRouter_1.default);
app.use("/api/v1/skill", skillRouter_1.default);
app.use("/api/v1/softwareapplication", softwareApplicationRouter_1.default);
app.use("/api/v1/project", projectRouter_1.default);
app.use("/", (req, res) => {
    res.send("dashboard");
});
// app.use(errorMiddleware);
exports.default = app;
