import User from "../model/User.js";
import Application from "../model/Application.js";
import SavedJob from "../model/SavedJob.js";
import Job from "../model/Job.js";

const getJobSeekerDashboard = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // =====================================================
    // GET USER
    // =====================================================

    const user = await User.findById(userId).select("-password -googleId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =====================================================
    // APPLICATION STATISTICS
    // =====================================================

    const totalApplications = await Application.countDocuments({
      user: userId,
    });

    const pendingApplications = await Application.countDocuments({
      user: userId,
      status: {
        $in: ["Applied", "Under Review"],
      },
    });

    const shortlistedApplications = await Application.countDocuments({
      user: userId,
      status: "Shortlisted",
    });

    const interviewApplications = await Application.countDocuments({
      user: userId,
      status: "Interview",
    });

    const acceptedApplications = await Application.countDocuments({
      user: userId,
      status: "Accepted",
    });

    const rejectedApplications = await Application.countDocuments({
      user: userId,
      status: "Rejected",
    });

    // =====================================================
    // SAVED JOBS
    // =====================================================

    const savedJobsCount = await SavedJob.countDocuments({
      user: userId,
    });

    // =====================================================
    // RECENT APPLICATIONS
    // =====================================================

    const recentApplications = await Application.find({
      user: userId,
    })
      .populate({
        path: "job",
        select:
          "title company companyLogo city country jobType workMode minSalary maxSalary",
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // =====================================================
    // RECENT / RECOMMENDED JOBS
    // =====================================================

    const recommendedJobs = await Job.find({
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .select(
        "title company companyLogo city country jobType workMode experience minSalary maxSalary skills",
      );

    // =====================================================
    // PROFILE COMPLETION
    // =====================================================

    const completionItems = [
      Boolean(user.name),
      Boolean(user.email),
      Boolean(user.phone),
      Boolean(user.location),
      Boolean(user.profileImage),
      Boolean(user.headline?.trim()),
      Boolean(user.bio?.trim()),
      Boolean(user.skills?.length),
      Boolean(user.experience?.length),
      Boolean(user.education?.length),
      Boolean(user.projects?.length),
      Boolean(user.resume?.url),
    ];

    const completedCount = completionItems.filter(Boolean).length;

    const profileCompletion = Math.round(
      (completedCount / completionItems.length) * 100,
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      user,

      profileCompletion: {
        percentage: profileCompletion,
        completed: completedCount,
        total: completionItems.length,
      },

      statistics: {
        applications: totalApplications,
        pending: pendingApplications,
        shortlisted: shortlistedApplications,
        interviews: interviewApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
        savedJobs: savedJobsCount,
      },

      recentApplications,

      recommendedJobs,
    });
  } catch (error) {
    console.error("Job seeker dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load job seeker dashboard",
      error: error.message,
    });
  }
};

export default getJobSeekerDashboard;
