import { Tasks } from "../models/taskModel.js";

export const statusCount = async (req, res) => {
  try {
    const counts = await Tasks.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    const result = {
      completed: 0,
      successfullyCompleted: 0,
      pending: 0,
      rejected: 0,
      totalTasks: 0,
    };

    counts.forEach((item) => {
      if (item._id === "completed") result.completed = item.total;
      if (item._id === "successfully completed")
        result.successfullyCompleted = item.total;
      if (item._id === "pending") result.pending = item.total;
      if (item._id === "rejected") result.rejected = item.total;

      // add to total count
      result.totalTasks += item.total;
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching task counts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
