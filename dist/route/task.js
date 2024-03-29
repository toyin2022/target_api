"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_1 = require("../controller/task");
const protectedRoute_1 = require("../middlewares/protectedRoute");
const router = (0, express_1.Router)();
router.get("/", protectedRoute_1.verifyToken, task_1.getAllTasks);
router.get("/:id", protectedRoute_1.verifyToken, task_1.getTask);
router.put("/:id", protectedRoute_1.verifyToken, task_1.updateTask);
router.post("/", protectedRoute_1.verifyToken, task_1.postTask);
router.delete("/:id", protectedRoute_1.verifyToken, task_1.deleteTask);
exports.default = router;
