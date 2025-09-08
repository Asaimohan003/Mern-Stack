import { User } from "../models/userModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "No User found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ message: "Login Sucessful", token, role: user.role });
  } catch {
    res.status(404).json({ error: "Login failed" });
  }
};
