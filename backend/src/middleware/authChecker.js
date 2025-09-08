import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authChecker = async (req, res, next) => {
  const JWT_SECRET = process.env.SECRET_KEY;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid TOKEN or TOKEN Expired" });
  }
};
