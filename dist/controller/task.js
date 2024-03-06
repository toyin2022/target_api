"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = exports.getTask = exports.updateTask = exports.postTask = exports.deleteTask = void 0;
const taskSchema_1 = require("../model/taskSchema");
const dayjs_1 = __importDefault(require("dayjs"));
function getAllTasks(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.user;
            const type = (_a = req.query) === null || _a === void 0 ? void 0 : _a.type;
            const day = (_b = req.query) === null || _b === void 0 ? void 0 : _b.date;
            let startDate;
            let endDate;
            if (day === "today") {
                startDate = (0, dayjs_1.default)().format("YYYY-MM-DD");
                endDate = (0, dayjs_1.default)().format("YYYY-MM-DD");
            }
            else if (day === "seven") {
                startDate = (0, dayjs_1.default)().subtract(7, "days").format("YYYY-MM-DD");
                endDate = (0, dayjs_1.default)().format("YYYY-MM-DD");
            }
            else if (day === "thirty") {
                startDate = (0, dayjs_1.default)().subtract(30, "days").format("YYYY-MM-DD");
                endDate = (0, dayjs_1.default)().format("YYYY-MM-DD");
            }
            let tasks;
            if (type) {
                tasks = yield taskSchema_1.Task.find(Object.assign({ userId: id, type }, (day && {
                    date: {
                        $lte: new Date(endDate),
                        $gte: new Date(startDate),
                    },
                }))).sort({ date: -1 });
            }
            else {
                tasks = yield taskSchema_1.Task.find(Object.assign({ userId: id }, (day && {
                    date: {
                        $lte: new Date(endDate),
                        $gte: new Date(startDate),
                    },
                }))).sort({ date: -1 });
            }
            console.log("Query Parameters:", req.query);
            // const tasks = await Task.find({ userId: id });
            res.status(200).json({ tasks: tasks });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllTasks = getAllTasks;
function getTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const task = yield taskSchema_1.Task.findById(id);
            res.status(200).json(task);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getTask = getTask;
function updateTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const task = yield taskSchema_1.Task.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), {
                new: true,
            });
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json(task);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateTask = updateTask;
function postTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = yield req.user;
            // console.log(id);
            const date = new Date(req.body.date);
            if (!id) {
                return res.status(401).json({ message: "unauthorized" });
            }
            const savedUser = yield new taskSchema_1.Task(Object.assign(Object.assign({ userId: id }, req.body), { date: date })).save();
            res.status(201).json({ message: "task created successfully", savedUser });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.postTask = postTask;
function deleteTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const task = yield taskSchema_1.Task.findByIdAndDelete(id);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json("task deleted successfully");
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteTask = deleteTask;
