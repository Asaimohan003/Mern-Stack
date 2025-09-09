import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    workerId: { type: String },
    workerIds: [{ type: String }],
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "pending" },
    path: { type: String },
    name: { type: String },
    teamName: { type: String },
  },
  { timestamps: true }
);

export const Tasks = mongoose.model("tasks", taskSchema);
