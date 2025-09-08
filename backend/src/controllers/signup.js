import { User } from "../models/userModel.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "Email does not exist. Contact admin." });
    }

    if (existingUser.password) {
      return res
        .status(400)
        .json({ error: "User already registered. Please login." });
    }

    existingUser.name = name;
    existingUser.password = password;
    await existingUser.save();

    res.status(201).json({ message: "Signup completed successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
};

export default signup;
