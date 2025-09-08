import { Tasks } from "../models/taskModel.js";

export const savePath = async (req, res) => {
  const { id } = req.params;
  const { path } = req.body;

  if (!path) {
    return res.status(400).json({ error: "path required" });
  }

  try {
    const task = await Tasks.findByIdAndUpdate(
      id,
      { $set: { path } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      message: "Path saved successfully",
      task,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
