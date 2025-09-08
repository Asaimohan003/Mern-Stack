import { Tasks } from "../models/taskModel.js";

export const workersTask = async (req, res) => {
  const { workerid } = req.params;
  try {
    const tasks = await Tasks.find({ workerid });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        tasks: [],
        message: "No tasks available for this worker",
      });
    }

    return res.status(200).json({ tasks, message: "SUCCESS" });
  } catch (err) {
    return res.status(500).json({ error: "FAILED", details: err.message });
  }
};
