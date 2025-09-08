import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import connect from "./src/db/connect.js";
import { logger } from "./src/middleware/logger.js";
import { authChecker } from "./src/middleware/authChecker.js";
import { Tasks } from "./src/models/taskModel.js";
import signup from "./src/controllers/signup.js";
import { login } from "./src/controllers/login.js";
import { getProfile } from "./src/controllers/getprofile.js";
import { addUserOrAdmin } from "./src/controllers/addUser.js";
import { getAllWorkers } from "./src/controllers/getAllWorkers.js";
import { deleteUser } from "./src/controllers/deleteUser.js";
import { assignTask } from "./src/controllers/assignTask.js";
import { workersTask } from "./src/controllers/getWorkerTask.js";
import { taskByID } from "./src/controllers/getTaskByID.js";
import { updateStatus } from "./src/controllers/updateStatus.js";
import { statusCount } from "./src/controllers/taskStatusCount.js";
import { upload } from "./src/middleware/storage.js";
import { uploadFiles } from "./src/controllers/uploadFiles.js";
import { savePath } from "./src/controllers/savePath.js";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = 5000;

app.use(logger);

connect();

app.get("/", (req, res) => {
  res.send("api is working");
});

//Signup
app.post("/signup", signup);

//Login with JWT
app.post("/login", login);

//get profile
app.get("/profile", authChecker, getProfile);

//add user
app.post("/add", authChecker, addUserOrAdmin);

//get all users
app.get("/admin/user", authChecker, getAllWorkers);

//delete user
app.delete("/delete/user/:id", authChecker, deleteUser);

// Assign task
app.post("/admin/assigntask", authChecker, assignTask);

// Assign task to multiple workers
app.post("/admin/assigntask/team", authChecker, async (req, res) => {
  try {
    const { workerIds, title, description, teamName } = req.body;

    if (!workerIds || !Array.isArray(workerIds) || workerIds.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one worker ID is required." });
    }
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    const newTask = new Tasks({
      workerIds,
      title,
      description,
      status: "pending",
      teamName,
    });

    const savedTask = await newTask.save();

    return res.status(201).json({
      message: "Task successfully created for multiple workers",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating bulk task:", error);
    return res.status(500).json({
      message: "Failed to create bulk task",
      error: error.message,
    });
  }
});

//get task from worker id
app.get("/task/worker/:workerid", authChecker, workersTask);

//get task by id
app.get("/task/:id", authChecker, taskByID);

//status update
app.patch("/task/update/:id", authChecker, updateStatus);

//upload proof for status update
app.post("/upload", authChecker, upload, uploadFiles);

//Display image
app.use("/uploads", express.static("uploads"));

//api to save path in the task
app.post("/savepath/:id", savePath);

//get task for superadmin by filter status
app.get("/status/count", authChecker, statusCount);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
