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
import { getAllTasks } from "./src/controllers/getAllTasks.js";
import { teamTask } from "./src/controllers/teamTask.js";
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
app.post("/admin/assigntask/team", authChecker, teamTask);

//get all tasks
app.get("/alltasks", authChecker, getAllTasks);

//get task from worker id
app.get("/task/worker/:workerId", authChecker, workersTask);

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
