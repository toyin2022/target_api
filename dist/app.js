"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./model/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const task_1 = __importDefault(require("./route/task"));
const user_1 = __importDefault(require("./route/user"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
(0, db_1.default)(process.env.MONGO_URI);
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
// app.use(MongoError());
app.use((err, req, res, next) => {
    if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
        return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
});
app.use((err, req, res, next) => {
    // Send an appropriate error response based on the error type
    res.status(500).json({ message: "Internal server error" });
});
//          ROUTES
app.use("/auth", user_1.default);
app.use("/tasks", task_1.default);
app.get("/", (req, res) => {
    res.send("hello world!");
});
app.listen(3000, () => {
    console.log("app listening on  3000");
});
