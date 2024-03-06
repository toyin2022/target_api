"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["default", "workout", "study", "others", "coding"],
        default: "default",
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
    title: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    isImportant: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.Task = mongoose_1.default.model("Task", taskSchema);
