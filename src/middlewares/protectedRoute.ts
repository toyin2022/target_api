import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, user: any) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        req.user = user;
      }
    );

    next();
  } catch (error) {
    next(error);
  }
};
