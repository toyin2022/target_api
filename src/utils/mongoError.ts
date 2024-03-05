import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";

export default function MongoError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof MongoServerError && err.code === 11000) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }
  res.status(500).json("internal server error");
  next(err);
}
