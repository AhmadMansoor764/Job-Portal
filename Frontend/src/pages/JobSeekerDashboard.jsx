import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBookmark,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaUser,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";

const JobSeekerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH USER PROFILE
  // =====================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/job-seeker/dashboard`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
        }

        setDashboard(data);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const profileCompletion = dashboard?.profileCompletion?.percentage || 0;

  const completedCount = dashboard?.profileCompletion?.completed || 0;

  const totalProfileItems = dashboard?.profileCompletion?.total || 0;

  const user = dashboard?.user;

  const statistics = dashboard?.statistics || {};

  const recentApplications = dashboard?.recentApplications || [];

  const recommendedJobs = dashboard?.recommendedJobs || [];
  // =====================================================
  // GREETING
  // =====================================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    iconBackground,
  }) => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>

            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>

            <p className="text-xs text-slate-400 mt-2">{description}</p>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBackground}`}
          >
            <Icon className="text-sm" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-sm font-medium text-slate-600 mt-4">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <FaExclamationCircle />
          </div>

          <h2 className="text-lg font-bold text-slate-900 mt-4">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
            mt-5
            px-4
            py-2.5
            rounded-xl
            bg-blue-600
            text-white
            text-sm
            font-semibold
            hover:bg-blue-700
            transition
          "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Job Seeker Dashboard
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                {getGreeting()}, {firstName} 👋
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Keep track of your job search and discover your next
                opportunity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/findjob"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-blue-700
                  shadow-sm
                  transition
                "
              >
                <FaSearch className="text-xs" />
                Find Jobs
              </Link>

              <Link
                to="/profile"
                className="
                  hidden
                  sm:inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-white
                  border
                  border-slate-200
                  text-slate-700
                  text-sm
                  font-semibold
                  hover:bg-slate-50
                  transition
                "
              >
                <FaUser className="text-xs" />
                My Profile
              </Link>
            </div>
          </div>
        </header>

        {/* =====================================================
            PROFILE COMPLETION
        ===================================================== */}

        {profileCompletion < 100 && (
          <section className="mb-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 sm:p-6 text-white shadow-sm">
              <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full bg-white/10" />
              <div className="absolute -right-5 -bottom-20 w-36 h-36 rounded-full bg-white/5" />

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <FaUser />
                  </div>

                  <div>
                    <h2 className="font-bold text-base sm:text-lg">
                      Your profile is {profileCompletion}% complete
                    </h2>

                    <p className="text-sm text-blue-100 mt-1 max-w-xl">
                      Complete your profile to help employers understand your
                      experience, skills, and career goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block w-36">
                    <div className="flex items-center justify-between text-xs text-blue-100 mb-2">
                      <span>Profile strength</span>
                      <span className="font-bold text-white">
                        {profileCompletion}%
                      </span>
                    </div>

                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{
                          width: `${profileCompletion}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    to="/profile/edit"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      bg-white
                      text-blue-700
                      text-sm
                      font-bold
                      hover:bg-blue-50
                      transition
                      whitespace-nowrap
                    "
                  >
                    Complete
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={FaBriefcase}
            label="Applications"
            value={statistics.applications || 0}
            description="Total applications submitted"
            iconBackground="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={FaClock}
            label="Pending"
            value={statistics.pending || 0}
            description="Awaiting employer response"
            iconBackground="bg-amber-50 text-amber-600"
          />

          <StatCard
            icon={FaCheckCircle}
            label="Shortlisted"
            value={statistics.shortlisted || 0}
            description="Applications shortlisted"
            iconBackground="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={FaBookmark}
            label="Saved Jobs"
            value={statistics.savedJobs || 0}
            description="Jobs saved for later"
            iconBackground="bg-violet-50 text-violet-600"
          />
        </section>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* =================================================
                RECENT APPLICATIONS
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Job Search
                  </p>

                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    Recent Applications
                  </h2>
                </div>

                <Link
                  to="/my-applications"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  View all
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>

              <div className="p-5 sm:p-6">
                {recentApplications.length === 0 ? (
                  <EmptyState
                    icon={FaBriefcase}
                    title="No applications yet"
                    description="When you apply for jobs, your recent applications will appear here."
                    actionLabel="Find a job"
                    actionLink="/findjob"
                  />
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((application) => (
                      <div
                        key={application._id}
                        className="
            group
            flex
            flex-col
            sm:flex-row
            sm:items-center
            gap-4
            p-4
            rounded-2xl
            border
            border-slate-100
            hover:border-blue-100
            hover:bg-slate-50
            transition
          "
                      >
                        <div
                          className="
              w-11
              h-11
              rounded-xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              flex-shrink-0
            "
                        >
                          <FaBriefcase className="text-sm" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {application.job?.title || "Job position"}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            {application.job?.company || "Company"}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                            {application.job?.city &&
                              application.job?.country && (
                                <span className="inline-flex items-center gap-1">
                                  <FaMapMarkerAlt className="text-[10px]" />
                                  {application.job.city},{" "}
                                  {application.job.country}
                                </span>
                              )}

                            <span>
                              Applied{" "}
                              {application.appliedAt
                                ? new Date(
                                    application.appliedAt,
                                  ).toLocaleDateString()
                                : "recently"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span
                            className={`
                inline-flex
                items-center
                px-3
                py-1.5
                rounded-full
                text-xs
                font-semibold
                ${
                  application.status === "Shortlisted"
                    ? "bg-emerald-50 text-emerald-700"
                    : application.status === "Rejected"
                      ? "bg-red-50 text-red-700"
                      : application.status === "Accepted"
                        ? "bg-blue-50 text-blue-700"
                        : application.status === "Interview"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-amber-50 text-amber-700"
                }
              `}
                          >
                            {application.status || "Applied"}
                          </span>

                          {application.job?._id && (
                            <Link
                              to={`/job/${application.job._id}`}
                              className="
                  w-9
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-slate-400
                  group-hover:text-blue-600
                  group-hover:bg-blue-50
                  transition
                "
                            >
                              <FaArrowRight className="text-xs" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                RECOMMENDED JOBS
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Opportunities
                  </p>

                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    Recommended Jobs
                  </h2>
                </div>

                <Link
                  to="/findjob"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  Explore
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>

              <div className="p-5 sm:p-6">
                {recommendedJobs.length === 0 ? (
                  <EmptyState
                    icon={FaSearch}
                    title="No recommended jobs yet"
                    description="Explore available jobs and find positions that match your skills and career goals."
                    actionLabel="Browse jobs"
                    actionLink="/findjob"
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recommendedJobs.map((job) => (
                      <Link
                        key={job._id}
                        to={`/job/${job._id}`}
                        className="
            group
            rounded-2xl
            border
            border-slate-100
            p-4
            hover:border-blue-100
            hover:bg-slate-50
            transition
          "
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="
                w-11
                h-11
                rounded-xl
                bg-slate-100
                flex
                items-center
                justify-center
                flex-shrink-0
                overflow-hidden
              "
                          >
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.company || "Company"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBriefcase className="text-slate-400 text-sm" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition">
                              {job.title}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1 truncate">
                              {job.company}
                            </p>
                          </div>

                          <FaArrowRight className="text-[10px] text-slate-300 group-hover:text-blue-600 transition mt-1" />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold">
                            {job.jobType}
                          </span>

                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                            {job.workMode}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
                          <FaMapMarkerAlt className="text-[10px]" />
                          {job.city}, {job.country}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">
            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Your Profile
                  </p>

                  <h2 className="font-bold text-slate-900 mt-1">
                    Profile Strength
                  </h2>
                </div>

                <span className="text-xl font-bold text-slate-900">
                  {profileCompletion}%
                </span>
              </div>

              <div className="mt-5">
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {completedCount} of {totalProfileItems} profile items
                  completed
                </p>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <Link
                  to="/profile"
                  className="
                    w-full
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                    transition
                  "
                >
                  View Profile
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </section>

            {/* =================================================
                RESUME CARD
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <FaFileAlt className="text-sm" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">Resume / CV</p>

                  {user?.resume?.url ? (
                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                      Your resume is uploaded
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1 leading-5">
                      Upload your resume so employers can learn more about your
                      experience.
                    </p>
                  )}
                </div>
              </div>

              <Link
                to="/profile"
                className="
                  mt-5
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-slate-900
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-slate-800
                  transition
                "
              >
                {user?.resume?.url ? "View Resume" : "Add Resume"}
                <FaArrowRight className="text-[10px]" />
              </Link>
            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Quick Actions
              </p>

              <h2 className="font-bold text-slate-900 mt-1">
                Manage your job search
              </h2>

              <div className="mt-5 space-y-2">
                <QuickAction
                  icon={FaSearch}
                  label="Find Jobs"
                  description="Explore available positions"
                  to="/findjob"
                />

                <QuickAction
                  icon={FaBookmark}
                  label="Saved Jobs"
                  description="Review jobs you saved"
                  to="/saved-jobs"
                />

                <QuickAction
                  icon={FaBriefcase}
                  label="My Applications"
                  description="Track your applications"
                  to="/my-applications"
                />

                <QuickAction
                  icon={FaUser}
                  label="Edit Profile"
                  description="Keep your profile updated"
                  to="/profile/edit"
                />
              </div>
            </section>

            {/* =================================================
                PROFILE TIP
            ================================================= */}

            {profileCompletion < 100 && (
              <section className="rounded-2xl bg-slate-900 p-5 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <FaExclamationCircle className="text-sm" />
                </div>

                <h2 className="font-bold mt-4">Improve your chances</h2>

                <p className="text-sm text-slate-300 leading-6 mt-2">
                  Complete your profile, add your skills, upload your resume,
                  and showcase your projects to make a stronger impression on
                  employers.
                </p>

                <Link
                  to="/profile/edit"
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-white
                    hover:text-blue-300
                    transition
                  "
                >
                  Complete profile
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
}) => {
  return (
    <div className="py-8 sm:py-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center">
        <Icon className="text-lg" />
      </div>

      <h3 className="text-base font-bold text-slate-900 mt-4">{title}</h3>

      <p className="text-sm text-slate-500 leading-6 max-w-md mt-2">
        {description}
      </p>

      <Link
        to={actionLink}
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          bg-blue-600
          text-white
          text-sm
          font-semibold
          hover:bg-blue-700
          transition
        "
      >
        <FaPlus className="text-[10px]" />
        {actionLabel}
      </Link>
    </div>
  );
};

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({ icon: Icon, label, description, to }) => {
  return (
    <Link
      to={to}
      className="
        flex
        items-center
        gap-3
        p-3
        rounded-xl
        hover:bg-slate-50
        transition
        group
      "
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
        <Icon className="text-xs" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition">
          {label}
        </p>

        <p className="text-xs text-slate-400 mt-0.5 truncate">{description}</p>
      </div>

      <FaArrowRight className="text-[9px] text-slate-300 group-hover:text-blue-600 transition" />
    </Link>
  );
};

export default JobSeekerDashboard;
