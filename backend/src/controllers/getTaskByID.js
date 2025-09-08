import { Tasks } from "../models/taskModel.js";

export const taskByID = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const task = await Tasks.findOne({ _id: id });
    if (!task) {
      return res.status(404).json({ error: "No task found" });
    }
    return res.status(200).json({ task, message: "Success" });
  } catch (err) {
    return res.status(500).json({ error: "FAILED", details: err.message });
  }
};
