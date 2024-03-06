"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
function MongoError(err, req, res, next) {
    if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
        return res.status(400).json({
            message: "Email already exists",
        });
    }
    res.status(500).json("internal server error");
    next(err);
}
exports.default = MongoError;
