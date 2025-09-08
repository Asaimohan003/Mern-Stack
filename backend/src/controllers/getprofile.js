import { User } from "../models/userModel.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
