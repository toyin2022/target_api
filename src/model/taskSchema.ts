import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["default", "workout", "study", "others", "coding"],
      default: "default",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    title: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Task = mongoose.model("Task", taskSchema);
