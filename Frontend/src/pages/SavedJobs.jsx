import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookmark,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLaptopHouse,
  FaDollarSign,
  FaBuilding,
  FaArrowRight,
  FaTrashAlt,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const SavedJobs = () => {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH SAVED JOBS
  // =====================================================

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/saved-jobs`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch saved jobs");
        }

        setSavedJobs(data.savedJobs || []);
      } catch (error) {
        console.error("Fetch saved jobs error:", error);

        setError(
          error.message || "Something went wrong while loading saved jobs.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // =====================================================
  // REMOVE SAVED JOB
  // =====================================================

  const removeSavedJob = async (jobId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/save`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove saved job");
      }

      setSavedJobs((prev) =>
        prev.filter((savedJob) => savedJob.job?._id !== jobId),
      );
    } catch (error) {
      console.error("Remove saved job error:", error);

      alert(error.message || "Failed to remove saved job.");
    }
  };

  const removeDeletedSavedJob = async (savedJobId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/saved/${savedJobId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove saved job");
      }

      setSavedJobs((prev) =>
        prev.filter((savedJob) => savedJob._id !== savedJobId),
      );
    } catch (error) {
      console.error("Remove deleted saved job error:", error);

      alert(error.message || "Failed to remove saved job.");
    }
  };

  // =====================================================
  // OPEN JOB
  // =====================================================

  const openJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // =====================================================
  // SALARY DISPLAY
  // =====================================================

  const getSalaryText = (job) => {
    const minSalary = job.minSalary;
    const maxSalary = job.maxSalary;

    if (minSalary != null && maxSalary != null) {
      return `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`;
    }

    if (minSalary != null) {
      return `From $${minSalary.toLocaleString()}`;
    }

    if (maxSalary != null) {
      return `Up to $${maxSalary.toLocaleString()}`;
    }

    return "Salary not specified";
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <h2 className="text-xl font-semibold text-slate-900 mt-5">
            Loading saved jobs...
          </h2>

          <p className="text-slate-500 mt-2">
            Please wait while we load your saved jobs.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-5">
            Unable to load saved jobs
          </h2>

          <p className="text-slate-500 mt-2">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="
              mt-6
              px-6
              py-3
              rounded-xl
              bg-blue-600
              text-white
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
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaBookmark className="text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Saved Jobs
              </h1>

              <p className="text-slate-500 mt-1">
                Jobs you've saved for later.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            COUNT
        ===================================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6">
          <p className="text-sm text-slate-500">
            You have{" "}
            <span className="font-bold text-slate-900">{savedJobs.length}</span>{" "}
            saved {savedJobs.length === 1 ? "job" : "jobs"}.
          </p>
        </div>

        {/* =====================================================
            SAVED JOBS
        ===================================================== */}

        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.map((savedJob) => {
              const job = savedJob.job;

              // =================================================
              // DELETED JOB
              // =================================================

              if (!job) {
                return (
                  <div
                    key={savedJob._id}
                    className="
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      p-5
                      sm:p-6
                      shadow-sm
                    "
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <FaTimesCircle className="text-2xl text-slate-400" />
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-slate-800">
                            Job no longer available
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">
                            This job has been deleted or is no longer available.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeDeletedSavedJob(savedJob._id)}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          px-5
                          py-2.5
                          rounded-xl
                          border
                          border-slate-200
                          text-slate-600
                          font-semibold
                          text-sm
                          hover:bg-red-50
                          hover:border-red-200
                          hover:text-red-600
                          transition
                        "
                      >
                        <FaTrashAlt />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              }

              const isClosed = job.status === "closed";

              return (
                <div
                  key={savedJob._id}
                  className={`
                    group
                    bg-white
                    border
                    rounded-2xl
                    p-5
                    sm:p-6
                    shadow-sm
                    transition-all
                    duration-200
                    ${
                      isClosed
                        ? "border-slate-200 opacity-90"
                        : "border-slate-200 hover:shadow-lg hover:border-blue-200"
                    }
                  `}
                >
                  {/* =================================================
                      TOP
                  ================================================= */}

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                    <div className="flex gap-4 min-w-0">
                      {/* COMPANY ICON */}

                      <div
                        className={`
                          w-14
                          h-14
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                          ${isClosed ? "bg-slate-100" : "bg-blue-50"}
                        `}
                      >
                        <FaBuilding
                          className={`
                            text-2xl
                            ${isClosed ? "text-slate-400" : "text-blue-600"}
                          `}
                        />
                      </div>

                      {/* JOB INFO */}

                      <div className="min-w-0">
                        <button
                          onClick={() => openJob(job._id)}
                          className={`
                            text-left
                            text-lg
                            sm:text-xl
                            font-bold
                            transition-colors
                            ${
                              isClosed
                                ? "text-slate-700 hover:text-slate-900"
                                : "text-slate-900 group-hover:text-blue-600"
                            }
                          `}
                        >
                          {job.title}
                        </button>

                        <p className="text-sm text-slate-500 mt-1">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-slate-400" />
                            {job.city}, {job.country}
                          </span>

                          <span className="flex items-center gap-2">
                            <FaBriefcase className="text-slate-400" />

                            {job.jobType}
                          </span>

                          <span className="flex items-center gap-2">
                            <FaLaptopHouse className="text-slate-400" />

                            {job.workMode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        STATUS BADGE
                    ================================================= */}

                    <div
                      className={`
                        flex
                        items-center
                        gap-2
                        self-start
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          isClosed
                            ? "bg-slate-100 text-slate-600"
                            : "bg-blue-50 text-blue-700"
                        }
                      `}
                    >
                      {isClosed ? (
                        <>
                          <FaTimesCircle />
                          Closed
                        </>
                      ) : (
                        <>
                          <FaBookmark />
                          Saved
                        </>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      DETAILS
                  ================================================= */}

                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <div className="flex flex-wrap gap-3">
                      {/* SALARY */}

                      <div
                        className={`
                          flex
                          items-center
                          gap-2
                          px-3
                          py-2
                          rounded-xl
                          ${
                            job.minSalary != null || job.maxSalary != null
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }
                        `}
                      >
                        <FaDollarSign />

                        <span className="text-sm font-semibold">
                          {getSalaryText(job)}
                        </span>
                      </div>

                      {/* SAVED DATE */}

                      <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm">
                        Saved{" "}
                        {new Date(savedJob.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-5">
                      {/* REMOVE */}

                      <button
                        onClick={() => removeSavedJob(job._id)}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          px-5
                          py-2.5
                          rounded-xl
                          border
                          border-slate-200
                          text-slate-600
                          font-semibold
                          text-sm
                          hover:bg-red-50
                          hover:border-red-200
                          hover:text-red-600
                          transition
                        "
                      >
                        <FaTrashAlt />
                        Remove
                      </button>

                      {/* VIEW DETAILS */}

                      <button
                        onClick={() => openJob(job._id)}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          px-5
                          py-2.5
                          rounded-xl
                          bg-blue-600
                          text-white
                          font-semibold
                          text-sm
                          hover:bg-blue-700
                          transition
                        "
                      >
                        View Details
                        <FaArrowRight />
                      </button>

                      {/* APPLY / VIEW JOB */}

                      <button
                        onClick={() => openJob(job._id)}
                        className={`
                          px-5
                          py-2.5
                          rounded-xl
                          text-white
                          font-semibold
                          text-sm
                          transition
                          ${
                            isClosed
                              ? "bg-slate-700 hover:bg-slate-800"
                              : "bg-slate-900 hover:bg-slate-800"
                          }
                        `}
                      >
                        {isClosed ? "View Job" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =====================================================
             EMPTY STATE
          ===================================================== */

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                <FaBookmark className="text-3xl text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-6">
                No saved jobs yet
              </h2>

              <p className="text-slate-500 mt-2">
                When you find a job you're interested in, save it here so you
                can easily come back to it later.
              </p>

              <button
                onClick={() => navigate("/findjob")}
                className="
                  mt-6
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Find Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
