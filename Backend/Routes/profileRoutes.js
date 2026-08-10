import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import cvUpload from "../middleware/cvUploadMiddleware.js";
import {
  getMyProfile,
  getMySkills,
  updateMySkills,
  getMyProjects,
  addProject,
  updateProject,
  deleteProject,
  getMyExperience,
  addExperience,
  updateExperience,
  deleteExperience,
  getMyEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getBasicProfile,
  updateBasicProfile,
  uploadProfileImage,
  deleteProfileImage,
  getProfessionalLinks,
  updateProfessionalLinks,
  uploadResume,
  deleteResume,
  getJobSeekerProfile,
  getEmployerProfile,
  updateEmployerProfile,
} from "../controller/profileController.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// =====================================================
// PROJECT ROUTES
// =====================================================

// Get logged-in user's projects
router.get("/projects", authMiddleware, getMyProjects);

// Add project
router.post("/projects", authMiddleware, addProject);

// Update project
router.put("/projects/:projectId", authMiddleware, updateProject);

// Delete project
router.delete("/projects/:projectId", authMiddleware, deleteProject);

// =====================================================
// SKILLS
// =====================================================

router.get("/skills", authMiddleware, getMySkills);

router.put("/skills", authMiddleware, updateMySkills);

// =====================================================
// EXPERIENCE ROUTES
// =====================================================

// Get logged-in user's experience
router.get("/experience", authMiddleware, getMyExperience);

// Add experience
router.post("/experience", authMiddleware, addExperience);

// Update experience
router.put("/experience/:experienceId", authMiddleware, updateExperience);

// Delete experience
router.delete("/experience/:experienceId", authMiddleware, deleteExperience);

// =====================================================
// EDUCATION ROUTES
// =====================================================

// Get logged-in user's education
router.get("/education", authMiddleware, getMyEducation);

// Add education
router.post("/education", authMiddleware, addEducation);

// Update education
router.put("/education/:educationId", authMiddleware, updateEducation);

// Delete education
router.delete("/education/:educationId", authMiddleware, deleteEducation);

// =====================================================
// BASIC PROFILE ROUTES
// =====================================================

router.get("/job-seeker/:id", getJobSeekerProfile);

router.get("/employer", authMiddleware, getEmployerProfile);

router.put("/employer", authMiddleware, updateEmployerProfile);

// Get basic profile
router.get("/basic", authMiddleware, getBasicProfile);

// Update basic profile
router.put("/basic", authMiddleware, updateBasicProfile);

router.get("/links", authMiddleware, getProfessionalLinks);

router.put("/links", authMiddleware, updateProfessionalLinks);

// =====================================================
// PROFILE IMAGE
// =====================================================

router.put(
  "/profile-image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage,
);

router.delete("/profile-image", authMiddleware, deleteProfileImage);

// RESUME / CV
// =====================================================

router.put("/resume", authMiddleware, cvUpload.single("resume"), uploadResume);

router.delete("/resume", authMiddleware, deleteResume);

export default router;
