import Job from "../model/Job.js";
import SavedJob from "../model/SavedJob.js";
import Application from "../model/Application.js";
import User from "../model/User.js";

// =====================================================
// GET ALL ACTIVE JOBS
// =====================================================

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "active",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// GET MY JOBS

export const getMyJobs = async (req, res) => {
  try {
    const employerId = req.user.id;

    const jobs = await Job.find({
      employer: employerId,
    }).sort({
      createdAt: -1,
    });

    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });

        return {
          ...job.toObject(),
          applicationCount,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      jobs: jobsWithApplications,
    });
  } catch (error) {
    console.error("Get my jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
    });
  }
};
// get a sungle job

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// save a job

export const saveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadySaved = await SavedJob.findOne({
      user: userId,
      job: id,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Job is already saved",
      });
    }

    const savedJob = await SavedJob.create({
      user: userId,
      job: id,
    });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save job",
    });
  }
};

export const checkSavedJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const savedJob = await SavedJob.findOne({
      user: userId,
      job: id,
    });

    return res.status(200).json({
      success: true,
      saved: !!savedJob,
      savedJob: savedJob || null,
    });
  } catch (error) {
    console.error("Check saved job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check saved job status",
    });
  }
};

// remove save jobs
export const removeSavedJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const savedJob = await SavedJob.findOneAndDelete({
      user: userId,
      job: id,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove saved job",
    });
  }
};

// =====================================================
// REMOVE SAVED JOB BY SAVED-JOB ID
// =====================================================

export const removeSavedJobById = async (req, res) => {
  try {
    const { savedJobId } = req.params;
    const userId = req.user.id;

    const savedJob = await SavedJob.findOneAndDelete({
      _id: savedJobId,
      user: userId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Saved job removed successfully",
    });
  } catch (error) {
    console.error("Remove saved job by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove saved job",
    });
  }
};

// get all saved jobs
// =====================================================
// GET SAVED JOBS
// =====================================================

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedJobs = await SavedJob.find({
      user: userId,
    })
      .populate("job")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved jobs",
    });
  }
};

// create a job
// =====================================================
// CREATE JOB
// =====================================================

export const createJob = async (req, res) => {
  try {
    // ===================================================
    // GET DATA FROM REQUEST
    // ===================================================

    const {
      title,
      category,
      company,
      companyDescription,
      description,
      responsibilities,
      requirements,
      skills,
      city,
      country,
      jobType,
      workMode,
      experience,
      minSalary,
      maxSalary,
    } = req.body;

    // ===================================================
    // CHECK USER ROLE
    // ===================================================

    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can create jobs.",
      });
    }

    // ===================================================
    // BASIC VALIDATION
    // ===================================================

    if (
      !title ||
      !category ||
      !company ||
      !description ||
      !city ||
      !country ||
      !jobType ||
      !workMode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // ===================================================
    // GET EMPLOYER
    // ===================================================

    const employer = await User.findById(req.user.id).select("profileImage");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer account not found.",
      });
    }

    // ===================================================
    // GET COMPANY LOGO
    // ===================================================

    const companyLogo = employer.profileImage || "";

    // ===================================================
    // CREATE JOB
    // ===================================================

    const job = await Job.create({
      title,
      category,
      company,
      companyLogo,
      companyDescription,
      description,
      responsibilities,
      requirements,
      skills,
      city,
      country,
      jobType,
      workMode,
      experience,
      minSalary,
      maxSalary,
      employer: employer._id,
      status: "active",
    });

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job.",
    });
  }
};

// =====================================================
// UPDATE JOB
// =====================================================

// =====================================================
// UPDATE JOB
// =====================================================

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      company,
      companyDescription,
      description,
      responsibilities,
      requirements,
      skills,
      city,
      country,
      jobType,
      workMode,
      experience,
      minSalary,
      maxSalary,
    } = req.body;

    // ===================================================
    // FIND JOB
    // ===================================================

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ===================================================
    // CHECK JOB OWNERSHIP
    // ===================================================

    if (job.employer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this job",
      });
    }

    // ===================================================
    // DON'T ALLOW EDITING CLOSED JOB
    // ===================================================

    if (job.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Closed jobs cannot be edited",
      });
    }

    // ===================================================
    // BASIC VALIDATION
    // ===================================================

    if (
      !title ||
      !category ||
      !company ||
      !description ||
      !city ||
      !country ||
      !jobType ||
      !workMode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // ===================================================
    // GET CURRENT EMPLOYER PROFILE IMAGE
    // ===================================================

    const employer = await User.findById(req.user.id).select("profileImage");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer account not found.",
      });
    }

    // ===================================================
    // UPDATE JOB
    // ===================================================

    job.title = title;
    job.category = category;
    job.company = company;
    job.companyLogo = employer.profileImage || "";
    job.companyDescription = companyDescription;
    job.description = description;
    job.responsibilities = responsibilities;
    job.requirements = requirements;
    job.skills = skills;
    job.city = city;
    job.country = country;
    job.jobType = jobType;
    job.workMode = workMode;
    job.experience = experience;
    job.minSalary = minSalary;
    job.maxSalary = maxSalary;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};

export const closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure this employer owns the job
    if (job.employer.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to close this job",
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "This job is already closed",
      });
    }

    job.status = "closed";

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job closed successfully",
      job,
    });
  } catch (error) {
    console.error("Close job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to close job",
    });
  }
};

export const reopenJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure this employer owns the job
    if (job.employer.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to reopen this job",
      });
    }

    if (job.status === "active") {
      return res.status(400).json({
        success: false,
        message: "This job is already active",
      });
    }

    job.status = "active";

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job reopened successfully",
      job,
    });
  } catch (error) {
    console.error("Reopen job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reopen job",
    });
  }
};
