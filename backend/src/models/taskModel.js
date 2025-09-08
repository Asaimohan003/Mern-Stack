import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    workerid: String,
    workerIds: [{ type: String }],
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "pending" },
    path: String,
    name: String,
    teamName: String,
  },
  { timestamps: true }
);

export const Tasks = mongoose.model("tasks", taskSchema);
