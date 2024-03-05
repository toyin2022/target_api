import { Router } from "express";
import {
  deleteTask,
  getAllTasks,
  getTask,
  postTask,
  updateTask,
} from "../controller/task";
import { verifyToken } from "../middlewares/protectedRoute";

const router = Router();

router.get("/", verifyToken, getAllTasks);
router.get("/:id", verifyToken, getTask);
router.put("/:id", verifyToken, updateTask);
router.post("/", verifyToken, postTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
