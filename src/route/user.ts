import express, { Router } from "express";
import { User } from "../model/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

//                  REGISTER USER.
router.post("/register", async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(403).json({
        message: "user already existed",
      });
    }
    await new User({ name, password, email }).save();

    res.status(201).json({
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Register

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = await jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    if (user) {
      const { password, ...userdata } = user.toObject();

      res
        .status(200)
        .cookie("token", token, { maxAge: 86400000, httpOnly: true })
        .json({ message: "User successfully logged in", user: userdata });
    }
  } catch (error) {
    next(error);
  }
});
export default router;
