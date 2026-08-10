import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaUsers,
  FaUserCheck,
  FaCalendarAlt,
  FaArrowRight,
  FaPlus,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/employer/dashboard`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      console.log("Employer dashboard:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load employer dashboard");
      }

      setDashboard(data);
    } catch (error) {
      console.error("Employer dashboard error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="text-3xl text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500">
            Loading employer dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-xl mx-auto mt-20 bg-white border border-red-200 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-bold text-red-600">
            Failed to load dashboard
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={fetchDashboard}
            className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};
  const user = dashboard?.user || {};
  const recentApplications = dashboard?.recentApplications || [];
  const recentJobs = dashboard?.recentJobs || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile spacing */}
      <div className="lg:hidden h-16" />

      <div className="p-5 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
        {/* ==============================
            HEADER
        ============================== */}

        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-blue-600">
                Employer Dashboard
              </p>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Welcome back{user.name ? `, ${user.name}` : ""} 👋
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Manage your job postings and find the right candidates.
              </p>
            </div>

            <Link
              to="/employer/jobs/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition"
            >
              <FaPlus className="text-xs" />
              Post a Job
            </Link>
          </div>
        </header>

        {/* ==============================
            STATISTICS
        ============================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={FaBriefcase}
            label="Total Jobs"
            value={statistics.totalJobs || 0}
            description="Jobs posted"
            iconBackground="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={FaBriefcase}
            label="Active Jobs"
            value={statistics.activeJobs || 0}
            description="Currently accepting applications"
            iconBackground="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={FaUsers}
            label="Applications"
            value={statistics.totalApplications || 0}
            description="Applications received"
            iconBackground="bg-violet-50 text-violet-600"
          />

          <StatCard
            icon={FaUserCheck}
            label="Shortlisted"
            value={statistics.shortlistedApplications || 0}
            description="Candidates shortlisted"
            iconBackground="bg-amber-50 text-amber-600"
          />
        </section>

        {/* ==============================
            MAIN CONTENT
        ============================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* ==============================
              RECENT APPLICATIONS
          ============================== */}

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Hiring
                </p>

                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  Recent Applications
                </h2>
              </div>

              <Link
                to="/employer/applicants"
                className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700"
              >
                View all
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="p-5 sm:p-6">
              {recentApplications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                    <FaUsers className="text-xl" />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    No applications yet
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                    Applications from candidates will appear here once someone
                    applies to your jobs.
                  </p>

                  <Link
                    to="/employer/jobs/create"
                    className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition"
                  >
                    <FaPlus className="text-xs" />
                    Post your first job
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ==============================
              RIGHT COLUMN
          ============================== */}

          <aside className="space-y-6">
            {/* QUICK ACTIONS */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Quick Actions
              </p>

              <h2 className="font-extrabold text-slate-900 mt-1">
                Manage your hiring
              </h2>

              <div className="mt-5 space-y-1">
                <QuickAction
                  icon={FaPlus}
                  label="Post a Job"
                  description="Create a new job posting"
                  to="/employer/jobs/create"
                />

                <QuickAction
                  icon={FaBriefcase}
                  label="My Jobs"
                  description="Manage your job postings"
                  to="/employer/jobs"
                />

                <QuickAction
                  icon={FaUsers}
                  label="Applicants"
                  description="Review candidates"
                  to="/employer/applicants"
                />

                <QuickAction
                  icon={FaCalendarAlt}
                  label="Interviews"
                  description="Manage interviews"
                  to="/employer/interviews"
                />
              </div>
            </section>

            {/* RECENT JOBS */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Your Jobs
                  </p>

                  <h2 className="font-extrabold text-slate-900 mt-1">
                    Recent Jobs
                  </h2>
                </div>

                <Link
                  to="/employer/jobs"
                  className="text-xs font-bold text-blue-600"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {recentJobs.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-5">
                    You haven't posted any jobs yet.
                  </p>
                ) : (
                  recentJobs.slice(0, 4).map((job) => (
                    <div
                      key={job._id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FaBriefcase className="text-xs" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {job.title}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {job.city}, {job.country}
                          </p>

                          <span
                            className={`inline-block mt-2 px-2 py-1 rounded-md text-[10px] font-bold ${
                              job.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* HIRING TIP */}

            <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <FaClock className="text-sm" />
              </div>

              <h3 className="font-extrabold mt-4">Keep your hiring active</h3>

              <p className="text-xs text-blue-100 leading-5 mt-2">
                Keep your job postings updated and respond quickly to promising
                candidates.
              </p>

              <Link
                to="/employer/jobs"
                className="inline-flex items-center gap-2 mt-4 bg-white text-blue-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition"
              >
                Manage Jobs
                <FaArrowRight className="text-[9px]" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>

          <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>

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

// =====================================================
// APPLICATION CARD
// =====================================================

const ApplicationCard = ({ application }) => {
  const applicant = application.user;
  const job = application.job;

  return (
    <Link
      to={`/applications/${application._id}/applicant`}
      className="block p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 overflow-hidden">
          {applicant?.profileImage ? (
            <img
              src={applicant.profileImage}
              alt={applicant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            applicant?.name?.charAt(0)?.toUpperCase() || "U"
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 truncate">
            {applicant?.name || "Unknown Applicant"}
          </p>

          <p className="text-xs text-slate-500 truncate mt-1">
            Applied for {job?.title || "Unknown Job"}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {applicant?.email || ""}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span
            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${
              application.status === "Shortlisted"
                ? "bg-amber-50 text-amber-600"
                : application.status === "Interview"
                  ? "bg-violet-50 text-violet-600"
                  : application.status === "Rejected"
                    ? "bg-red-50 text-red-500"
                    : application.status === "Accepted"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600"
            }`}
          >
            {application.status}
          </span>
        </div>
      </div>
    </Link>
  );
};

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({ icon: Icon, label, description, to }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition">
        <Icon className="text-xs" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">{label}</p>

        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>

      <FaArrowRight className="text-[9px] text-slate-300 group-hover:text-blue-600 transition" />
    </Link>
  );
};

export default EmployerDashboard;
