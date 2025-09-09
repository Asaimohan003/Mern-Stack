import { Tasks } from "../models/taskModel.js";

export const assignTask = async (req, res) => {
  try {
    const { workerId, title, description, status, name } = req.body;

    if (!workerId || !title || !description) {
      return res
        .status(400)
        .json({ message: "Worker ID, title, and description are required." });
    }
    const newTask = new Tasks({ workerId, title, description, status, name });
    const savedTask = await newTask.save();

    return res.status(201).json({
      message: "Task successfully created",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};
