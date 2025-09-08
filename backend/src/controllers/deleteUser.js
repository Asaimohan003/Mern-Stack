import { Tasks } from "../models/taskModel.js";
import { User } from "../models/userModel.js";

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ Delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "No user found" });
    }

    // ✅ Delete tasks belonging to the user
    await Tasks.deleteMany({ workerid: id });

    return res
      .status(200)
      .json({ message: "User and their tasks deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
