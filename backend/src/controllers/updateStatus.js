import { Tasks } from "../models/taskModel.js";

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const task = await Tasks.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.status === status) {
      return res.status(400).json({
        error: `Task is already in '${status}' status`,
      });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (err) {
    console.error("Update task error:", err.message);
    return res.status(500).json({ error: "FAILED", details: err.message });
  }
};
