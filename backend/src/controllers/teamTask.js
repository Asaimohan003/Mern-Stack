import { Tasks } from "../models/taskModel.js";

export const teamTask = async (req, res) => {
  try {
    const { workerIds, title, description, teamName } = req.body;

    if (!workerIds || !Array.isArray(workerIds) || workerIds.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one worker ID is required." });
    }
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    const newTask = new Tasks({
      workerIds,
      title,
      description,
      status: "pending",
      teamName,
    });

    const savedTask = await newTask.save();

    return res.status(201).json({
      message: "Task successfully created for multiple workers",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating bulk task:", error);
    return res.status(500).json({
      message: "Failed to create bulk task",
      error: error.message,
    });
  }
};
