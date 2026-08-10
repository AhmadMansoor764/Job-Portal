import Application from "../model/Application.js";
import Job from "../model/Job.js";
import supabase from "../config/supabase.js";

// APPLY FOR A JOB

// APPLY FOR A JOB

export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // CHECK CV

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your CV",
      });
    }

    // CHECK JOB

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // CHECK JOB STATUS

    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    // CHECK DUPLICATE APPLICATION

    const existingApplication = await Application.findOne({
      user: userId,
      job: id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // CV FILE

    const file = req.file;

    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    const fileName = `${userId}-${id}-${Date.now()}.${fileExtension}`;

    const filePath = `applications/${fileName}`;

    // UPLOAD CV TO SUPABASE

    const { error: uploadError } = await supabase.storage
      .from("jobs-cv")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase CV upload error:", uploadError);

      return res.status(500).json({
        success: false,
        message: "Failed to upload CV",
      });
    }

    // GET PUBLIC CV URL

    const { data: publicUrlData } = supabase.storage
      .from("jobs-cv")
      .getPublicUrl(filePath);

    const cvUrl = publicUrlData.publicUrl;

    // CREATE APPLICATION

    const application = await Application.create({
      user: userId,
      job: id,

      cv: {
        url: cvUrl,
        publicId: filePath,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },

      status: "Applied",
    });

    // RESPONSE

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply for job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to apply for job",
    });
  }
};

// =====================================================
// GET EMPLOYER SHORTLISTED APPLICATIONS
// =====================================================

export const getEmployerShortlisted = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    const applications = await Application.find({
      status: "Shortlisted",
    })
      .populate({
        path: "user",
        select: "name email phone location profileImage headline skills",
      })
      .populate({
        path: "job",
        match: { employer: employerId },
        select: "title company city country jobType workMode",
      })
      .sort({ updatedAt: -1 });

    // Remove applications belonging to other employers
    const employerApplications = applications.filter(
      (application) => application.job !== null,
    );

    return res.status(200).json({
      success: true,
      applications: employerApplications,
    });
  } catch (error) {
    console.error("Shortlisted applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shortlisted applications",
      error: error.message,
    });
  }
};

// =====================================================
// GET EMPLOYER INTERVIEWS
// =====================================================

export const getEmployerInterviews = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    const applications = await Application.find({
      status: "Interview",
    })
      .populate({
        path: "user",
        select: "name email phone location profileImage headline skills",
      })
      .populate({
        path: "job",
        match: { employer: employerId },
        select: "title company city country jobType workMode",
      })
      .sort({ updatedAt: -1 });

    const employerApplications = applications.filter(
      (application) => application.job !== null,
    );

    return res.status(200).json({
      success: true,
      interviews: employerApplications,
    });
  } catch (error) {
    console.error("Employer interviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};
// GET USER'S APPLICATIONS

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({
      user: userId,
    })
      .populate("job")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// GET SINGLE APPLICATION

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await Application.findOne({
      _id: id,
      user: userId,
    }).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
    });
  }
};

// CHECK IF USER APPLIED TO A JOB

export const checkApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await Application.findOne({
      user: userId,
      job: id,
    });

    return res.status(200).json({
      success: true,
      applied: !!application,
      application: application || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to check application status",
    });
  }
};

export const getAllEmployerApplicants = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    // First get all jobs belonging to this employer
    const jobs = await Job.find({
      employer: employerId,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Get applications for those jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate({
        path: "user",
        select: "name email phone profileImage headline skills location",
      })
      .populate({
        path: "job",
        select: "title company city country jobType workMode",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Employer applicants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employer applicants",
      error: error.message,
    });
  }
};

// GET APPLICANTS FOR MY JOB
export const getJobApplicants = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { jobId } = req.params;

    // Make sure the job belongs to this employer
    const job = await Job.findOne({
      _id: jobId,
      employer: employerId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you do not own this job",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "user",
        "name email phone location profileImage headline bio skills experience education projects resume linkedinUrl githubUrl portfolioUrl",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      job,
      applications,
    });
  } catch (error) {
    console.error("Get job applicants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
    });
  }
};

// GET APPLICATION DETAILS FOR EMPLOYER

export const getEmployerApplicationById = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate(
        "user",
        "name email phone location profileImage headline bio skills experience education projects resume linkedinUrl githubUrl portfolioUrl",
      )
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure this application belongs to a job
    // owned by the logged-in employer
    if (application.job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this application",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get employer application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
    });
  }
};

// UPDATE APPLICATION STATUS

export const updateApplicationStatus = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Rejected",
      "Accepted",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // Find application and populate job
    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure employer owns this job
    if (application.job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    // Populate candidate after saving
    await application.populate(
      "user",
      "name email phone location profileImage headline bio skills experience education projects resume linkedinUrl githubUrl portfolioUrl",
    );

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

// SCHEDULE / UPDATE INTERVIEW

export const scheduleInterview = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;

    const { date, time, type, meetingLink, location, notes } = req.body;

    // FIND APPLICATION

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // CHECK JOB OWNERSHIP

    if (application.job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this interview",
      });
    }

    // VALIDATE BASIC INFORMATION

    if (!date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: "Date, time, and interview type are required",
      });
    }

    // VALIDATE INTERVIEW TYPE

    const allowedTypes = ["Online", "In Person", "Phone"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview type",
      });
    }

    // TYPE-SPECIFIC VALIDATION

    if (type === "Online" && !meetingLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required for an online interview",
      });
    }

    if (type === "In Person" && !location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location is required for an in-person interview",
      });
    }

    // CHECK INTERVIEW STATUS

    if (application.interview?.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "A completed interview cannot be modified",
      });
    }

    if (application.interview?.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "A cancelled interview cannot be modified",
      });
    }

    // UPDATE INTERVIEW

    application.interview = {
      scheduled: true,
      status: "Scheduled",
      date: new Date(date),
      time: time.trim(),
      type,
      meetingLink: meetingLink?.trim() || "",
      location: location?.trim() || "",
      notes: notes?.trim() || "",
      completedAt: null,
      cancelledAt: null,
    };

    // UPDATE APPLICATION STATUS

    application.status = "Interview";

    // SAVE

    await application.save();

    // POPULATE APPLICANT

    await application.populate(
      "user",
      "name email phone location profileImage headline bio skills experience education projects resume linkedinUrl githubUrl portfolioUrl",
    );

    return res.status(200).json({
      success: true,
      message:
        application.interview?.status === "Scheduled"
          ? "Interview updated successfully"
          : "Interview scheduled successfully",
      application,
    });
  } catch (error) {
    console.error("Schedule/update interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule/update interview",
    });
  }
};

// =====================================================
// CANCEL INTERVIEW
// =====================================================

export const cancelInterview = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;

    // =====================================================
    // FIND APPLICATION
    // =====================================================

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // =====================================================
    // CHECK OWNERSHIP
    // =====================================================

    if (application.job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this interview",
      });
    }

    // =====================================================
    // CHECK INTERVIEW
    // =====================================================

    if (!application.interview?.scheduled) {
      return res.status(400).json({
        success: false,
        message: "No scheduled interview found",
      });
    }

    // =====================================================
    // CHECK STATUS
    // =====================================================

    if (application.interview.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Interview is already cancelled",
      });
    }

    if (application.interview.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "A completed interview cannot be cancelled",
      });
    }

    // =====================================================
    // CANCEL
    // =====================================================

    application.interview.status = "Cancelled";

    application.interview.cancelledAt = new Date();

    // =====================================================
    // SAVE
    // =====================================================

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully",
      application,
    });
  } catch (error) {
    console.error("Cancel interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel interview",
    });
  }
};

// =====================================================
// MARK INTERVIEW COMPLETED
// =====================================================

export const completeInterview = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;

    // =====================================================
    // FIND APPLICATION
    // =====================================================

    const application = await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // =====================================================
    // CHECK OWNERSHIP
    // =====================================================

    if (application.job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this interview",
      });
    }

    // =====================================================
    // CHECK INTERVIEW
    // =====================================================

    if (!application.interview?.scheduled) {
      return res.status(400).json({
        success: false,
        message: "No scheduled interview found",
      });
    }

    // =====================================================
    // CHECK STATUS
    // =====================================================

    if (application.interview.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    if (application.interview.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "A cancelled interview cannot be completed",
      });
    }

    // =====================================================
    // COMPLETE INTERVIEW
    // =====================================================

    application.interview.status = "Completed";

    application.interview.completedAt = new Date();

    // =====================================================
    // SAVE
    // =====================================================

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Interview marked as completed",
      application,
    });
  } catch (error) {
    console.error("Complete interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete interview",
    });
  }
};
