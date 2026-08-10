import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import getEmployerDashboard from "../controller/employerDashboardController.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployerDashboard);

export default router;
