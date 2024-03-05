import { NextFunction, Request, Response } from "express";
import { Task } from "../model/taskSchema";
import dayjs from "dayjs";

interface AuthenticatedRequest extends Request {
  user?: any;
}

async function getAllTasks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;
    const type = req.query?.type;
    const day = req.query?.date;
    let startDate;
    let endDate;

    if (day === "today") {
      startDate = dayjs().format("YYYY-MM-DD");
      endDate = dayjs().format("YYYY-MM-DD");
    } else if (day === "seven") {
      startDate = dayjs().subtract(7, "days").format("YYYY-MM-DD");
      endDate = dayjs().format("YYYY-MM-DD");
    } else if (day === "thirty") {
      startDate = dayjs().subtract(30, "days").format("YYYY-MM-DD");
      endDate = dayjs().format("YYYY-MM-DD");
    }

    let tasks;
    if (type) {
      tasks = await Task.find({
        userId: id,
        type,
        ...(day && {
          date: {
            $lte: new Date(endDate as string),
            $gte: new Date(startDate as string),
          },
        }),
      }).sort({ date: -1 });
    } else {
      tasks = await Task.find({
        userId: id,
        ...(day && {
          date: {
            $lte: new Date(endDate as string),
            $gte: new Date(startDate as string),
          },
        }),
      }).sort({ date: -1 });
    }
    console.log("Query Parameters:", req.query);

    // const tasks = await Task.find({ userId: id });
    res.status(200).json({ tasks: tasks });
  } catch (error) {
    next(error);
  }
}
async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}
async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}
async function postTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = await req.user;
    // console.log(id);
    const date = new Date(req.body.date);
    if (!id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const savedUser = await new Task({
      userId: id,
      ...req.body,
      date: date,
    }).save();

    res.status(201).json({ message: "task created successfully", savedUser });
  } catch (error) {
    next(error);
  }
}
async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json("task deleted successfully");
  } catch (error) {
    next(error);
  }
}
export { deleteTask, postTask, updateTask, getTask, getAllTasks };
