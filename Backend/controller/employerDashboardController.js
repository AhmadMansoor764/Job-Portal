import User from "../model/User.js";
import Job from "../model/Job.js";
import Application from "../model/Application.js";

const getEmployerDashboard = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    // =====================================================
    // GET EMPLOYER
    // =====================================================

    const user = await User.findById(employerId).select("-password -googleId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    // =====================================================
    // GET EMPLOYER'S JOBS
    // =====================================================

    const jobs = await Job.find({
      employer: employerId,
    })
      .sort({ createdAt: -1 })
      .select(
        "title company companyLogo city country jobType workMode status createdAt",
      );

    const jobIds = jobs.map((job) => job._id);

    // =====================================================
    // JOB STATISTICS
    // =====================================================

    const totalJobs = jobs.length;

    const activeJobs = jobs.filter((job) => job.status === "active").length;

    const closedJobs = jobs.filter((job) => job.status === "closed").length;

    // =====================================================
    // APPLICATION STATISTICS
    // =====================================================

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const pendingApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: {
        $in: ["Applied", "Under Review"],
      },
    });

    const shortlistedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Shortlisted",
    });

    const interviewApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Interview",
    });

    const acceptedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
    });

    const rejectedApplications = await Application.countDocuments({
      job: { $in: jobIds },
      status: "Rejected",
    });

    // =====================================================
    // RECENT APPLICATIONS
    // =====================================================

    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .populate({
        path: "user",
        select: "name email phone profileImage headline",
      })
      .populate({
        path: "job",
        select: "title company city country jobType workMode",
      })
      .sort({ appliedAt: -1 })
      .limit(8);

    // =====================================================
    // RECENT JOBS
    // =====================================================

    const recentJobs = await Job.find({
      employer: employerId,
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .select(
        "title company companyLogo city country jobType workMode status createdAt",
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      user,

      statistics: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        interviewApplications,
        acceptedApplications,
        rejectedApplications,
      },

      recentApplications,

      recentJobs,
    });
  } catch (error) {
    console.error("Employer dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load employer dashboard",
      error: error.message,
    });
  }
};

export default getEmployerDashboard;
