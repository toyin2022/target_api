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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userSchema_1 = require("../model/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
//                  REGISTER USER.
router.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email } = req.body;
    try {
        const user = yield userSchema_1.User.findOne({ email });
        if (user) {
            res.status(403).json({
                message: "user already existed",
            });
        }
        yield new userSchema_1.User({ name, password, email }).save();
        res.status(201).json({
            message: "user created successfully",
        });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/", (req, res) => {
    res.status(200).send("welcome to login");
});
// Register
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userSchema_1.User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
        const validPass = yield bcrypt_1.default.compare(password, user.password);
        if (!validPass) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = yield jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        if (user) {
            const _a = user.toObject(), { password } = _a, userdata = __rest(_a, ["password"]);
            res
                .status(200)
                .cookie("token", token, { maxAge: 86400000, httpOnly: true })
                .json({ message: "User successfully logged in", user: userdata });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
