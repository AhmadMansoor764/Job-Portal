import express from "express";
import requireRole from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cvUpload from "../middleware/cvUploadMiddleware.js";

import {
  applyForJob,
  getMyApplications,
  getApplicationById,
  checkApplication,
  getJobApplicants,
  getAllEmployerApplicants,
  getEmployerApplicationById,
  updateApplicationStatus,
  scheduleInterview,
  cancelInterview,
  completeInterview,
  getEmployerShortlisted,
  getEmployerInterviews,
} from "../controller/applicationController.js";

const router = express.Router();

// Check whether current user applied to a job
router.get(
  "/:id/status",
  authMiddleware,
  requireRole("jobSeeker"),
  checkApplication,
);

// Apply for a job
router.post(
  "/:id/apply",
  authMiddleware,
  requireRole("jobSeeker"),
  cvUpload.single("cv"),
  applyForJob,
);

// Get logged-in user's applications
router.get(
  "/my-applications",
  authMiddleware,
  requireRole("jobSeeker"),
  getMyApplications,
);

router.get(
  "/employer/shortlisted",
  authMiddleware,
  requireRole("employer"),
  getEmployerShortlisted,
);

router.get(
  "/employer/interviews",
  authMiddleware,
  requireRole("employer"),
  getEmployerInterviews,
);

router.get(
  "/my-applications/:id",
  authMiddleware,
  requireRole("jobSeeker"),
  getApplicationById,
);

router.get(
  "/employer/applicants",
  authMiddleware,
  requireRole("employer"),
  getAllEmployerApplicants,
);

router.get(
  "/job/:jobId/applicants",
  authMiddleware,
  requireRole("employer"),
  getJobApplicants,
);

// Employer views one application
router.get(
  "/employer/:id",
  authMiddleware,
  requireRole("employer"),
  getEmployerApplicationById,
);

// Employer changes application status
router.put(
  "/employer/:id/status",
  authMiddleware,
  requireRole("employer"),
  updateApplicationStatus,
);

// Employer schedules an interview
router.put(
  "/employer/:id/interview",
  authMiddleware,
  requireRole("employer"),
  scheduleInterview,
);

// Employer cancels an interview
router.patch(
  "/employer/:id/interview/cancel",
  authMiddleware,
  requireRole("employer"),
  cancelInterview,
);

// Employer marks an interview as completed
router.patch(
  "/employer/:id/interview/complete",
  authMiddleware,
  requireRole("employer"),
  completeInterview,
);

export default router;
