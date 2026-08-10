import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBriefcase,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaEye,
  FaPlus,
  FaLock,
} from "react-icons/fa";

const MyJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/my-jobs`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch jobs");
        }

        setJobs(data.jobs || []);
      } catch (error) {
        console.error("My jobs error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const activeJobs = jobs.filter((job) => job.status === "active");

  const closedJobs = jobs.filter((job) => job.status === "closed");

  const totalApplications = jobs.reduce(
    (total, job) => total + (job.applicationCount || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load jobs
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-16 py-3 flex items-center justify-between gap-4">
            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={() => navigate("/employer/jobs")}
              className="
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-600
          hover:text-blue-600
          transition
        "
            >
              <FaArrowLeft className="text-xs" />
              <span>Back to Dashboard</span>
            </button>

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div
                className="
            w-9
            h-9
            rounded-lg
            bg-blue-50
            flex
            items-center
            justify-center
          "
              >
                <FaBriefcase className="text-blue-600" />
              </div>

              <span className="font-bold text-slate-900">JobPortal</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Jobs
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage the jobs you have posted.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-job")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            <FaPlus />
            Post New Job
          </button>
        </div>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <StatCard
            icon={<FaBriefcase />}
            label="Total Jobs"
            value={jobs.length}
          />

          <StatCard
            icon={<FaBriefcase />}
            label="Active Jobs"
            value={activeJobs.length}
          />

          <StatCard
            icon={<FaLock />}
            label="Closed Jobs"
            value={closedJobs.length}
          />

          <StatCard
            icon={<FaUsers />}
            label="Applications"
            value={totalApplications}
          />
        </div>

        {/* JOBS */}

        <div className="mt-8">
          {jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaBriefcase className="text-xl" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-5">
                No jobs posted yet
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Create your first job posting and start finding great
                candidates.
              </p>

              <button
                onClick={() => navigate("/create-job")}
                className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    {/* JOB INFORMATION */}

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <FaBriefcase />
                        )}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {job.title}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {job.city}, {job.country}
                          </span>

                          <span>{job.jobType}</span>

                          <span>{job.workMode}</span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM */}

                  <div className="border-t border-slate-100 mt-5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaUsers className="text-blue-600" />

                      <span>
                        <strong className="text-slate-900">
                          {job.applicationCount || 0}
                        </strong>{" "}
                        applications
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/employer/jobs/${job._id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <FaEye />
                        View
                      </button>

                      <button
                        onClick={() => navigate(`/jobs/${job._id}/edit`)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        <FaUsers />
                        Applicants
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
