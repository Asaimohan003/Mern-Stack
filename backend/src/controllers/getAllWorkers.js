import { User } from "../models/userModel.js";

export const getAllWorkers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Unable to get all users" });
  }
};
