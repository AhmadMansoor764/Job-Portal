import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaSearch,
} from "react-icons/fa";

const EmployerApplicants = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");

  // =====================================================
  // FETCH ALL EMPLOYER APPLICANTS
  // =====================================================

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/employer/applicants`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applicants");
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Employer applicants error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading applicants...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <FaUser />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to load applicants
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={() => navigate("/employer/dashboard")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // UNIQUE JOBS
  // =====================================================

  const jobs = [
    ...new Map(
      applications
        .filter((application) => application.job)
        .map((application) => [application.job._id, application.job]),
    ).values(),
  ];

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const statusCounts = {
    All: applications.length,

    Applied: applications.filter((app) => app.status === "Applied").length,

    "Under Review": applications.filter((app) => app.status === "Under Review")
      .length,

    Shortlisted: applications.filter((app) => app.status === "Shortlisted")
      .length,

    Interview: applications.filter((app) => app.status === "Interview").length,

    Accepted: applications.filter((app) => app.status === "Accepted").length,

    Rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  // =====================================================
  // FILTER APPLICATIONS
  // =====================================================

  const filteredApplications = applications.filter((application) => {
    const applicant = application.user;
    const job = application.job;

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      applicant?.name?.toLowerCase().includes(search) ||
      applicant?.email?.toLowerCase().includes(search) ||
      applicant?.headline?.toLowerCase().includes(search) ||
      job?.title?.toLowerCase().includes(search) ||
      applicant?.skills?.some((skill) => skill.toLowerCase().includes(search));

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    const matchesJob = jobFilter === "All" || job?._id === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile spacing */}
      <div className="lg:hidden h-16" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <button
                onClick={() => navigate("/employer/dashboard")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-4"
              >
                <FaArrowLeft className="text-xs" />
                Dashboard
              </button>

              <p className="text-sm font-bold text-blue-600">Employer</p>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Applicants
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Review and manage candidates who applied to your jobs.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
              <p className="text-2xl font-extrabold text-blue-600">
                {applications.length}
              </p>

              <p className="text-xs font-semibold text-slate-500 mt-1">
                Total Applications
              </p>
            </div>
          </div>
        </header>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MiniStat
            label="Total"
            value={statusCounts.All}
            background="bg-blue-50"
            text="text-blue-600"
          />

          <MiniStat
            label="Under Review"
            value={statusCounts["Under Review"]}
            background="bg-yellow-50"
            text="text-yellow-600"
          />

          <MiniStat
            label="Shortlisted"
            value={statusCounts.Shortlisted}
            background="bg-purple-50"
            text="text-purple-600"
          />

          <MiniStat
            label="Interviews"
            value={statusCounts.Interview}
            background="bg-indigo-50"
            text="text-indigo-600"
          />
        </section>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px_220px] gap-4">
            {/* SEARCH */}

            <div>
              <label className="text-xs font-semibold text-slate-500">
                Search Applicants
              </label>

              <div className="relative mt-2">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applicants or jobs..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* STATUS */}

            <div>
              <label className="text-xs font-semibold text-slate-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="All">All Applicants</option>

                <option value="Applied">Applied</option>

                <option value="Under Review">Under Review</option>

                <option value="Shortlisted">Shortlisted</option>

                <option value="Interview">Interview</option>

                <option value="Accepted">Accepted</option>

                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* JOB */}

            <div>
              <label className="text-xs font-semibold text-slate-500">
                Job
              </label>

              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="All">All Jobs</option>

                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STATUS BUTTONS */}

          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-100">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}

                <span className="ml-1.5 opacity-80">{count}</span>
              </button>
            ))}
          </div>
        </section>

        {/* =====================================================
            RESULTS HEADER
        ===================================================== */}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Candidates
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredApplications.length} applicant
              {filteredApplications.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* =====================================================
            APPLICANTS
        ===================================================== */}

        {filteredApplications.length === 0 ? (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <FaUser className="text-slate-400 text-xl" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-5">
              No matching applicants
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setJobFilter("All");
              }}
              className="mt-5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const applicant = application.user;

              const job = application.job;

              return (
                <section
                  key={application._id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    {/* APPLICANT */}

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
                        {applicant?.profileImage ? (
                          <img
                            src={applicant.profileImage}
                            alt={applicant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-blue-600">
                            {applicant?.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          {applicant?.name || "Unknown Applicant"}
                        </h2>

                        {applicant?.headline && (
                          <p className="text-sm text-blue-600 mt-1">
                            {applicant.headline}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-slate-500">
                          {applicant?.email && (
                            <span className="flex items-center gap-1.5">
                              <FaEnvelope />
                              {applicant.email}
                            </span>
                          )}

                          {applicant?.phone && (
                            <span className="flex items-center gap-1.5">
                              <FaPhone />
                              {applicant.phone}
                            </span>
                          )}

                          {applicant?.location && (
                            <span className="flex items-center gap-1.5">
                              <FaMapMarkerAlt />
                              {applicant.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* JOB + STATUS */}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <FaBriefcase className="text-blue-500 text-xs" />

                          <p className="text-xs font-bold text-slate-800">
                            {job?.title || "Job unavailable"}
                          </p>
                        </div>

                        {job?.company && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            {job.company}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center">
                        <ApplicationStatus status={application.status} />
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/applications/${application._id}/applicant`)
                        }
                        className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        View Applicant
                      </button>
                    </div>
                  </div>

                  {/* SKILLS */}

                  {applicant?.skills?.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.slice(0, 8).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APPLICATION DATE */}

                  <div className="mt-4 text-xs text-slate-400">
                    Applied{" "}
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// MINI STAT
// =====================================================

const MiniStat = ({ label, value, background, text }) => {
  return (
    <div className={`rounded-2xl p-5 ${background}`}>
      <p className={`text-xs font-semibold ${text}`}>{label}</p>

      <p className="text-2xl font-extrabold text-slate-900 mt-2">{value}</p>
    </div>
  );
};

// =====================================================
// APPLICATION STATUS
// =====================================================

const ApplicationStatus = ({ status }) => {
  const styles = {
    Applied: "bg-blue-50 text-blue-600",
    "Under Review": "bg-yellow-50 text-yellow-700",
    Shortlisted: "bg-purple-50 text-purple-600",
    Interview: "bg-indigo-50 text-indigo-600",
    Rejected: "bg-red-50 text-red-600",
    Accepted: "bg-green-50 text-green-600",
  };

  return (
    <span
      className={`px-3 py-2 rounded-lg text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default EmployerApplicants;
