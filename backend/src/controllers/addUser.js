import { User } from "../models/userModel.js";

export const addUserOrAdmin = async (req, res) => {
  try {
    const { name, age, email, role } = req.body;
    if (!email || !name || !age || !role) {
      return res.status(404).json({ error: "All feilds are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const user = new User({ email, age, role, name });
    await user.save();
    res.status(201).json({ message: "User Added" });
  } catch {
    res.status(500).json({ error: "Failed to add user" });
  }
};
