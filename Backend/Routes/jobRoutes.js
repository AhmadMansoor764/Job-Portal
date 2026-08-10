import express from "express";
import requireRole from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getJobs,
  getJobById,
  createJob,
  saveJob,
  removeSavedJob,
  removeSavedJobById,
  getSavedJobs,
  checkSavedJob,
  getMyJobs,
  updateJob,
  closeJob,
  reopenJob,
} from "../controller/jobController.js";
const router = express.Router();
// Create a new job
router.post("/", authMiddleware, requireRole("employer"), createJob);

// Get employer's own jobs
router.get("/my-jobs", authMiddleware, requireRole("employer"), getMyJobs);

router.get("/saved-jobs", authMiddleware, getSavedJobs);

// Get all active jobs
router.get("/", getJobs);

// Save a job
router.post("/:id/save", authMiddleware, saveJob);

// Remove saved job
router.delete("/:id/save", authMiddleware, removeSavedJob);

// check whether job is saved
router.get("/:id/save/status", authMiddleware, checkSavedJob);

router.delete("/saved/:savedJobId", authMiddleware, removeSavedJobById);

// Get one job
router.get("/:id", getJobById);

// Update employer's job
router.put("/:id", authMiddleware, requireRole("employer"), updateJob);

//close job
router.patch("/:id/close", authMiddleware, requireRole("employer"), closeJob);

//Reopen job
router.patch("/:id/reopen", authMiddleware, requireRole("employer"), reopenJob);

export default router;
