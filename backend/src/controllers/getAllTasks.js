import { Tasks } from "../models/taskModel.js";

// ✅ Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found" });
    }
    return res.status(200).json({ tasks, message: "Success" });
  } catch (err) {
    return res.status(500).json({ error: "FAILED", details: err.message });
  }
};
