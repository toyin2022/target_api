"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connection = (connectionString) => {
    if (connectionString) {
        mongoose_1.default.connect(connectionString);
        console.log("mongoose connected successfully");
    }
    else {
        console.error("MongoDB URI should be a string");
    }
};
exports.default = connection;
