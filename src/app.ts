import express from "express";
import connection from "./model/db";
import dotenv from "dotenv";
import { MongoServerError } from "mongodb";
import TaskRoute from "./route/task";
import UserRoute from "./route/user";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();
connection(process.env.MONGO_URI as string);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(MongoError());
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof MongoServerError && err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Send an appropriate error response based on the error type
    res.status(500).json({ message: "Internal server error" });
  }
);
//          ROUTES
app.use("/auth", UserRoute);
app.use("/tasks", TaskRoute);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(3000, () => {
  console.log("app listening on  3000");
});
