import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import getJobSeekerDashboard from "../controller/jobSeekerDashboardController.js";

const router = express.Router();

router.get("/", authMiddleware, getJobSeekerDashboard);

export default router;
