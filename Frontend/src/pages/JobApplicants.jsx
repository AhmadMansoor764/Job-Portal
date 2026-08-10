import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/job/${jobId}/applicants`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applicants");
        }

        setJob(data.job);
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Applicants error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

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
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load applicants
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={() => navigate("/my-jobs")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  const filteredApplications = applications.filter((application) => {
    const applicant = application.user;

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      applicant?.name?.toLowerCase().includes(search) ||
      applicant?.email?.toLowerCase().includes(search) ||
      applicant?.headline?.toLowerCase().includes(search) ||
      applicant?.skills?.some((skill) => skill.toLowerCase().includes(search));

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <button
          onClick={() => navigate("/my-jobs")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition mb-6"
        >
          <FaArrowLeft className="text-xs" />
          Back to My Jobs
        </button>

        {/* =====================================================
            JOB HEADER
        ===================================================== */}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FaBriefcase className="text-blue-600" />
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {job?.title}
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">{job?.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-slate-400" />
                  {job?.city}, {job?.country}
                </span>

                <span>{job?.jobType}</span>

                <span>{job?.workMode}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl px-5 py-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {applications.length}
              </p>

              <p className="text-xs font-semibold text-slate-500 mt-1">
                Applicants
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            APPLICANTS
        ===================================================== */}

        {/* =====================================================
    APPLICANT FILTERS
===================================================== */}

        <section className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* SEARCH */}

            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500">
                Search Applicants
              </label>

              <div className="relative mt-2">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, headline, or skill..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* STATUS FILTER */}

            <div className="w-full lg:w-56">
              <label className="text-xs font-semibold text-slate-500">
                Application Status
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
          </div>

          {/* STATUS COUNTS */}

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

        <div className="mt-6">
          {filteredApplications.length === 0 ? (
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <FaUser className="text-slate-400 text-xl" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-5">
                No matching applicants
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Try changing your search or application status filter.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
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

                return (
                  <section
                    key={application._id}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      {/* APPLICANT */}

                      <div className="flex items-start gap-4">
                        {/* PROFILE IMAGE */}

                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-50 flex items-center justify-center shrink-0">
                          {applicant?.profileImage ? (
                            <img
                              src={applicant.profileImage}
                              alt={applicant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-blue-600">
                              {applicant?.name?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* INFORMATION */}

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

                      {/* STATUS + ACTION */}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <ApplicationStatus status={application.status} />

                        <button
                          onClick={() =>
                            navigate(
                              `/applications/${application._id}/applicant`,
                            )
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
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// STATUS COMPONENT
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
      {status}
    </span>
  );
};

export default JobApplicants;
