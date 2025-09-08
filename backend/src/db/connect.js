import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch {
    console.error("Failed to connect to MongoDB", err);
  }
};

export default connect;
