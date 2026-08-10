import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { formatSalary } from "../utils/formatSalary";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLaptopHouse,
  FaDollarSign,
  FaCalendarAlt,
  FaBuilding,
  FaClock,
  FaCheck,
  FaSpinner,
  FaEdit,
  FaUsers,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";

import { CiBookmark } from "react-icons/ci";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // JOB STATE
  // =====================================================

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActions, setShowActions] = useState(false);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const isJobSeeker = user?.role === "jobSeeker";

  const isLoggedIn = Boolean(user);
  const isGuest = !loadingUser && !user;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // =====================================================
  // APPLICATION STATE
  // =====================================================

  const [checkingApplication, setCheckingApplication] = useState(true);
  const [applying, setApplying] = useState(false);

  const [application, setApplication] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [savingJob, setSavingJob] = useState(false);

  const employerId =
    typeof job?.employer === "object" ? job.employer?._id : job?.employer;

  const isEmployer = user?.role === "employer";

  const isJobOwner =
    isEmployer &&
    employerId &&
    String(employerId) === String(user?._id || user?.id);
  // =====================================================
  // GET JOB
  // =====================================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${id}`,
        );

        const data = await response.json();

        console.log("Job details received:", data);

        if (!response.ok) {
          throw new Error(data.message || "Job not found");
        }

        setJob(data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // =====================================================
  // CHECK IF USER ALREADY APPLIED
  // =====================================================

  useEffect(() => {
    if (!job) {
      return;
    }

    if (!user) {
      setCheckingApplication(false);
      setApplication(null);
      return;
    }

    if (isJobOwner) {
      setCheckingApplication(false);
      setApplication(null);
      return;
    }

    const checkApplication = async () => {
      try {
        setCheckingApplication(true);
        setApplicationError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/${id}/status`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check application status");
        }

        if (data.applied) {
          setApplication(data.application);
        } else {
          setApplication(null);
        }
      } catch (error) {
        console.error("Error checking application:", error);
        setApplicationError(error.message);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, [job, id, user, isJobOwner]);

  // =====================================================
  // CHECK IF JOB IS SAVED
  // =====================================================

  useEffect(() => {
    if (!job) {
      return;
    }

    if (!user) {
      setCheckingSaved(false);
      setIsSaved(false);
      return;
    }

    if (isJobOwner) {
      setCheckingSaved(false);
      setIsSaved(false);
      return;
    }

    const checkSavedJob = async () => {
      try {
        setCheckingSaved(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${id}/save/status`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check saved job");
        }

        setIsSaved(data.saved);
      } catch (error) {
        console.error("Error checking saved job:", error);
        setIsSaved(false);
      } finally {
        setCheckingSaved(false);
      }
    };

    checkSavedJob();
  }, [job, id, user, isJobOwner]);

  // =====================================================
  // SAVE / UNSAVE JOB
  // =====================================================

  const handleToggleSave = async () => {
    try {
      setSavingJob(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${id}/save`,
        {
          method: isSaved ? "DELETE" : "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update saved job");
      }

      setIsSaved(!isSaved);

      console.log(data.message);
    } catch (error) {
      console.error("Save job error:", error);
      alert(error.message);
    } finally {
      setSavingJob(false);
    }
  };

  // =====================================================
  // APPLY FOR JOB
  // =====================================================

  const handleApply = async () => {
    try {
      setApplying(true);
      setApplicationMessage("");
      setApplicationError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}/apply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      console.log("Apply response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to apply for this job");
      }

      // Save returned application
      setApplication(data.application);

      setApplicationMessage(
        data.message || "Application submitted successfully!",
      );

      console.log("Application created:", data.application);
    } catch (error) {
      console.error("Application error:", error);

      setApplicationError(error.message);
    } finally {
      setApplying(false);
    }
  };

  // =====================================================
  // VIEW APPLICATION
  // =====================================================

  const handleViewApplication = () => {
    if (application?._id) {
      navigate(`/my-applications/${application._id}`);
    } else {
      navigate("/my-applications");
    }
  };
  // =====================================================
  // SHARE
  // =====================================================

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job?.title || "Job Opportunity",
          text: `Check out this job at ${job?.company || "this company"}.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Job link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Unable to share job:", error);
      }
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading || loadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">Loading job details...</p>
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <span className="text-2xl text-red-500">!</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to load job
          </h2>

          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  // =====================================================
  // SALARY
  // =====================================================

  const salary = formatSalary(job.minSalary, job.maxSalary);
  // =====================================================
  // POSTED DATE
  // =====================================================

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : job.postedAt || "Recently";
  // =====================================================
  // APPLICATION STATUS
  // =====================================================

  const applicationStatus = application?.status || "Applied";

  const handleToggleJobStatus = async () => {
    const isCurrentlyActive = job.status === "active";

    const confirmed = window.confirm(
      isCurrentlyActive
        ? "Are you sure you want to close this job? New applicants will no longer be able to apply."
        : "Are you sure you want to reopen this job?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${job._id}/${
          isCurrentlyActive ? "close" : "reopen"
        }`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${isCurrentlyActive ? "close" : "reopen"} job`,
        );
      }

      setJob(data.job);

      alert(
        isCurrentlyActive
          ? "Job closed successfully."
          : "Job reopened successfully.",
      );
    } catch (error) {
      console.error("Toggle job status error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-white">
      <div className="mb-6 px-4 pt-4">
        <button
          onClick={() => {
            if (isGuest) {
              navigate("/");
            } else if (user?.role === "jobSeeker") {
              navigate("/findjobs");
            } else {
              navigate(-1);
            }
          }}
          className="
      inline-flex
      items-center
      gap-2
      text-sm
      font-semibold
      text-slate-600
      hover:text-blue-600
      transition-colors
    "
        >
          <FaArrowLeft />

          {isGuest
            ? "Back to Home"
            : user?.role === "jobSeeker"
              ? "Back to Find Jobs"
              : "Back"}
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4 mb-7">
          {/* =================================================
      RIGHT SIDE ACTIONS
  ================================================= */}

          {isJobOwner ? (
            <div>
              {/* ================================
          DESKTOP ACTIONS
      ================================= */}
              <div className="hidden sm:flex items-center gap-2">
                {/* EDIT */}
                <button
                  onClick={() => navigate(`/jobs/${job._id}/edit`)}
                  className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            border
            border-slate-200
            bg-white
            text-sm
            font-semibold
            text-slate-700
            hover:bg-slate-50
            transition
          "
                >
                  <FaEdit />
                  Edit Job
                </button>

                {/* CLOSE / REOPEN */}
                <button
                  onClick={handleToggleJobStatus}
                  className={`
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            text-sm
            font-semibold
            transition
            ${
              job.status === "active"
                ? "border border-red-200 text-red-600 bg-white hover:bg-red-50"
                : "border border-green-200 text-green-600 bg-white hover:bg-green-50"
            }
          `}
                >
                  {job.status === "active" ? (
                    <>
                      <FaLock />
                      Close Job
                    </>
                  ) : (
                    <>
                      <FaLockOpen />
                      Reopen Job
                    </>
                  )}
                </button>

                {/* APPLICANTS */}
                <button
                  onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                  className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-blue-600
            text-white
            text-sm
            font-semibold
            hover:bg-blue-700
            transition
          "
                >
                  <FaUsers />
                  Applicants
                </button>
              </div>

              {/* ================================
          MOBILE ACTION MENU
      ================================= */}
              <div className="relative sm:hidden">
                {/* 3 DOT BUTTON */}
                <button
                  onClick={() => setShowActions((prev) => !prev)}
                  className="
            w-10
            h-10
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-600
            flex
            items-center
            justify-center
            hover:bg-slate-50
            hover:text-blue-600
            active:scale-95
            transition-all
          "
                  aria-label="Job actions"
                  aria-expanded={showActions}
                >
                  <FaEllipsisV />
                </button>

                {/* ================================
            MOBILE DROPDOWN
        ================================= */}
                <div
                  className={`
            absolute
            right-0
            top-[calc(100%+8px)]
            z-50
            w-52
            origin-top-right
            bg-white
            border
            border-slate-200
            rounded-xl
            shadow-lg
            p-2

            transition-all
            duration-200
            ease-out

            ${
              showActions
                ? "opacity-100 scale-100 translate-y-0 visible"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
            }
          `}
                >
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setShowActions(false);
                      navigate(`/jobs/${job._id}/edit`);
                    }}
                    className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              font-medium
              text-slate-700
              hover:bg-slate-50
              transition
            "
                  >
                    <FaEdit className="text-slate-500" />
                    Edit Job
                  </button>

                  {/* CLOSE / REOPEN */}
                  <button
                    onClick={() => {
                      setShowActions(false);
                      handleToggleJobStatus();
                    }}
                    className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              font-medium
              transition

              ${
                job.status === "active"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              }
            `}
                  >
                    {job.status === "active" ? (
                      <>
                        <FaLock />
                        Close Job
                      </>
                    ) : (
                      <>
                        <FaLockOpen />
                        Reopen Job
                      </>
                    )}
                  </button>

                  {/* APPLICANTS */}
                  <button
                    onClick={() => {
                      setShowActions(false);
                      navigate(`/jobs/${job._id}/applicants`);
                    }}
                    className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              font-medium
              text-blue-600
              hover:bg-blue-50
              transition
            "
                  >
                    <FaUsers />
                    Applicants
                  </button>
                </div>
              </div>
            </div>
          ) : isGuest ? (
            <button
              onClick={() => navigate(`/login?redirect=/jobs/${job._id}`)}
              className="
      inline-flex
      items-center
      gap-2
      px-4
      py-2
      rounded-lg
      border
      border-slate-200
      bg-white
      text-sm
      font-semibold
      text-slate-600
      hover:border-blue-300
      hover:text-blue-600
      hover:bg-blue-50
      transition-all
    "
            >
              <CiBookmark className="text-lg" />
              Login to Save
            </button>
          ) : (
            <button
              onClick={handleToggleSave}
              disabled={checkingSaved || savingJob}
              className={`
      flex
      items-center
      gap-2
      px-4
      py-2
      rounded-lg
      border
      text-sm
      font-medium
      transition
      disabled:opacity-60
      disabled:cursor-not-allowed

      ${
        isSaved
          ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
      }
    `}
            >
              {checkingSaved
                ? "Checking..."
                : savingJob
                  ? isSaved
                    ? "Removing..."
                    : "Saving..."
                  : isSaved
                    ? "Saved"
                    : "Save Job"}
            </button>
          )}
        </div>
        {/* =================================================
            JOB HEADER
        ================================================= */}

        <section className="border-b border-slate-200 pb-7">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* COMPANY LOGO */}

            <div
              className="
                w-14
                h-14
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="
                    w-full
                    h-full
                    object-cover
                    rounded-xl
                  "
                />
              ) : (
                <FaBuilding className="text-xl text-blue-600" />
              )}
            </div>

            {/* JOB INFORMATION */}

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                {job.company}
              </p>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  text-slate-900
                  mt-1
                  tracking-tight
                "
              >
                {job.title}
              </h1>

              {/* META */}

              <div
                className="
    flex
    flex-wrap
    items-center
    gap-x-4
    gap-y-2
    mt-3
    text-sm
    text-slate-500
  "
              >
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-slate-400" />
                  {job.city}, {job.country}
                </span>

                <span className="text-slate-300">•</span>

                <span>{job.jobType}</span>

                <span className="text-slate-300">•</span>

                <span>{salary}</span>

                <span className="text-slate-300">•</span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    job.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      job.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  {job.status === "active" ? "Active" : "Closed"}
                </span>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="flex flex-wrap items-center gap-3 mt-6">
                {/* =============================================
                    APPLICATION BUTTON
                ============================================= */}

                {isJobOwner ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold">
                    <FaBuilding className="text-slate-400" />
                    Employer View
                  </div>
                ) : isGuest ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/login?redirect=/jobs/${job._id}`)
                      }
                      className="
        px-7
        py-2.5
        rounded-lg
        bg-blue-600
        text-white
        text-sm
        font-semibold
        shadow-sm
        hover:bg-blue-700
        hover:shadow-md
        active:scale-[0.98]
        transition-all
      "
                    >
                      Log In to Apply
                    </button>

                    <button
                      onClick={() => navigate("/accountType")}
                      className="
        px-6
        py-2.5
        rounded-lg
        border
        border-slate-200
        bg-white
        text-slate-700
        text-sm
        font-semibold
        hover:bg-slate-50
        transition
      "
                    >
                      Create Account
                    </button>
                  </div>
                ) : checkingApplication ? (
                  <button
                    disabled
                    className="
      px-7
      py-2.5
      rounded-lg
      bg-slate-100
      text-slate-500
      text-sm
      font-semibold
      flex
      items-center
      gap-2
      cursor-not-allowed
    "
                  >
                    <FaSpinner className="animate-spin" />
                    Checking application...
                  </button>
                ) : application ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      disabled
                      className="
        px-6
        py-2.5
        rounded-lg
        bg-green-50
        border
        border-green-200
        text-green-700
        text-sm
        font-semibold
        flex
        items-center
        gap-2
      "
                    >
                      <FaCheck />
                      Already Applied
                    </button>

                    <button
                      onClick={handleViewApplication}
                      className="
        px-6
        py-2.5
        rounded-lg
        bg-blue-600
        text-white
        text-sm
        font-semibold
        hover:bg-blue-700
        transition-all
      "
                    >
                      View Application
                    </button>
                  </div>
                ) : job.status !== "active" ? (
                  <button
                    disabled
                    className="
      px-6
      py-2.5
      rounded-lg
      bg-slate-100
      border
      border-slate-200
      text-slate-500
      text-sm
      font-semibold
      flex
      items-center
      gap-2
    "
                  >
                    <FaLock />
                    Applications Closed
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/jobs/${job._id}/apply`)}
                    disabled={applying}
                    className="
      px-7
      py-2.5
      rounded-lg
      bg-blue-600
      text-white
      text-sm
      font-semibold
      shadow-sm
      hover:bg-blue-700
      hover:shadow-md
      active:scale-[0.98]
      transition-all
      disabled:opacity-60
      disabled:cursor-not-allowed
      flex
      items-center
      gap-2
    "
                  >
                    {applying ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Applying...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                )}

                {isGuest && (
                  <section
                    className="
      mt-6
      rounded-2xl
      border
      border-blue-100
      bg-blue-50/60
      p-5
    "
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div
                        className="
          w-11
          h-11
          rounded-xl
          bg-blue-100
          flex
          items-center
          justify-center
          flex-shrink-0
        "
                      >
                        <FaLock className="text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">
                          Interested in this opportunity?
                        </h3>

                        <p className="text-sm text-slate-600 mt-1 leading-6">
                          Create a free account or log in to apply for this
                          position, save jobs, and manage your applications.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            navigate(`/login?redirect=/jobs/${job._id}`)
                          }
                          className="
            px-4
            py-2
            rounded-lg
            bg-blue-600
            text-white
            text-sm
            font-semibold
            hover:bg-blue-700
            transition
          "
                        >
                          Log In
                        </button>

                        <button
                          onClick={() => navigate("/accountType")}
                          className="
            px-4
            py-2
            rounded-lg
            bg-white
            border
            border-blue-200
            text-blue-600
            text-sm
            font-semibold
            hover:bg-blue-50
            transition
          "
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================= */}

              {applicationMessage && (
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-green-600
                    font-medium
                  "
                >
                  <FaCheck />

                  {applicationMessage}
                </div>
              )}

              {/* =================================================
                  APPLICATION ERROR
              ================================================= */}

              {applicationError && !application && (
                <p className="mt-4 text-sm text-red-500">{applicationError}</p>
              )}
            </div>
          </div>
        </section>

        {job.status !== "active" && (
          <section
            className="
      mt-6
      rounded-2xl
      border
      border-red-200
      bg-red-50
      p-5
    "
          >
            <div className="flex items-start gap-3">
              <div
                className="
          w-10
          h-10
          rounded-full
          bg-red-100
          flex
          items-center
          justify-center
          flex-shrink-0
        "
              >
                <FaLock className="text-red-600" />
              </div>

              <div>
                <h3 className="font-bold text-red-900">
                  This job is no longer accepting applications
                </h3>

                <p className="text-sm text-red-700 mt-1">
                  The employer has closed this position. You can still view the
                  job details, but new applications are not currently being
                  accepted.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            APPLICATION STATUS CARD
        ================================================= */}

        {!isJobOwner && application && (
          <section
            className="
              mt-6
              rounded-2xl
              border
              border-green-200
              bg-green-50
              p-5
            "
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-green-100
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  <FaCheck className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-green-900">
                    Application submitted
                  </h3>

                  <p className="text-sm text-green-700 mt-1">
                    Your application is currently{" "}
                    <span className="font-semibold">{applicationStatus}</span>.
                  </p>

                  {application?.createdAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleViewApplication}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-white
                  border
                  border-green-200
                  text-green-700
                  text-sm
                  font-semibold
                  hover:bg-green-100
                  transition
                "
              >
                View Application
              </button>
            </div>
          </section>
        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[minmax(0,1fr)_340px]
            gap-7
            mt-7
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <main className="space-y-7">
            <section
              className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-5
  "
            >
              <h2 className="text-lg font-bold text-slate-900">Job Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FaBriefcase className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Employment Type</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {job.jobType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <FaLaptopHouse className="text-purple-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Work Mode</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {job.workMode || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <FaClock className="text-amber-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {job.experience || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <FaDollarSign className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Salary</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {salary}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            {/* DESCRIPTION */}

            <section>
              <h2 className="text-lg font-bold text-slate-900">
                Job Description
              </h2>

              <div
                className="
      mt-4
      text-sm
      sm:text-[15px]
      text-slate-600
      leading-7
      whitespace-pre-line
    "
              >
                {job.description}
              </div>
            </section>

            {/* RESPONSIBILITIES */}

            {job.responsibilities?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900">
                  Responsibilities
                </h2>

                <ul className="mt-4 space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li
                      key={index}
                      className="
                          flex
                          items-start
                          gap-3
                          text-sm
                          text-slate-600
                        "
                    >
                      <span
                        className="
    w-6
    h-6
    rounded-full
    bg-blue-50
    text-blue-600
    flex
    items-center
    justify-center
    flex-shrink-0
    mt-0.5
    text-xs
    font-bold
  "
                      >
                        {index + 1}
                      </span>

                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* REQUIREMENTS */}

            {job.requirements?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900">
                  Requirements
                </h2>

                <ul className="mt-4 space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="
                          flex
                          items-start
                          gap-3
                          text-sm
                          text-slate-600
                        "
                    >
                      <span
                        className="
    w-6
    h-6
    rounded-full
    bg-blue-50
    text-blue-600
    flex
    items-center
    justify-center
    flex-shrink-0
    mt-0.5
    text-xs
    font-bold
  "
                      >
                        {index + 1}
                      </span>

                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* SKILLS */}

            {job.skills?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900">
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-2 mt-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="
    px-3.5
    py-2
    rounded-lg
    bg-blue-50
    border
    border-blue-100
    text-blue-700
    text-xs
    font-semibold
    transition
  "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            {/* JOB OVERVIEW */}

            <section
              className="
                bg-slate-50
                rounded-2xl
                border
                border-slate-100
                p-5
              "
            >
              <h2 className="text-lg font-bold text-slate-900">Job Overview</h2>

              <div className="mt-5 space-y-0">
                <OverviewRow
                  label="Posted"
                  value={postedDate}
                  icon={<FaCalendarAlt />}
                  color="blue"
                />

                <OverviewRow
                  label="Job Type"
                  value={job.jobType}
                  icon={<FaBriefcase />}
                  color="indigo"
                />

                <OverviewRow
                  label="Work Mode"
                  value={job.workMode}
                  icon={<FaLaptopHouse />}
                  color="purple"
                />

                <OverviewRow
                  label="Experience"
                  value={job.experience || "Not specified"}
                  icon={<FaClock />}
                  color="amber"
                />

                <OverviewRow
                  label="Salary"
                  value={salary}
                  icon={<FaDollarSign />}
                  color="green"
                />

                <OverviewRow
                  label="Location"
                  value={`${job.city}, ${job.country}`}
                  icon={<FaMapMarkerAlt />}
                  color="rose"
                  last
                />
              </div>
            </section>

            {/* COMPANY */}

            <section
              className="
                bg-slate-50
                rounded-2xl
                border
                border-slate-100
                p-5
              "
            >
              <h2 className="text-lg font-bold text-slate-900">
                About Company
              </h2>

              <div className="flex items-center gap-3 mt-5">
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  <FaBuilding className="text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{job.company}</p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {job.industry || "Company"}
                    {job.companySize ? ` • ${job.companySize}` : ""}
                  </p>
                </div>
              </div>

              {job.companyDescription && (
                <p
                  className="
                    text-sm
                    text-slate-500
                    leading-6
                    mt-4
                  "
                >
                  {job.companyDescription}
                </p>
              )}

              {job.companyId && (
                <button
                  onClick={() => navigate(`/companies/${job.companyId}`)}
                  className="
      mt-4
      text-sm
      font-semibold
      text-blue-600
      hover:text-blue-700
      transition
    "
                >
                  View Company Profile →
                </button>
              )}
            </section>
          </aside>
          {!isJobOwner && (
            <div className="lg:col-span-2 border-t border-slate-200 pt-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Interested in this position?
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {isGuest
                      ? "Log in or create an account to apply for this position."
                      : "Submit your application and take the next step in your career."}
                  </p>
                </div>

                {!application && job.status === "active" && isJobSeeker && (
                  <button
                    onClick={() =>
                      navigate(
                        isGuest
                          ? `/login?redirect=/jobs/${job._id}`
                          : `/jobs/${job._id}/apply`,
                      )
                    }
                    disabled={applying}
                    className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-6
            py-3
            rounded-xl
            bg-blue-600
            text-white
            text-sm
            font-semibold
            hover:bg-blue-700
            transition
            disabled:opacity-60
          "
                  >
                    {isGuest ? "Log In to Apply" : "Apply Now"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// OVERVIEW ROW
// =====================================================

const OverviewRow = ({ label, value, icon, color = "blue", last = false }) => {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
    },

    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },

    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
    },

    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
    },

    green: {
      bg: "bg-green-50",
      text: "text-green-600",
    },

    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  };

  const selectedColor = colors[color];

  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-3
        py-3.5
        ${!last ? "border-b border-slate-200" : ""}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`
            w-8
            h-8
            rounded-lg
            ${selectedColor.bg}
            flex
            items-center
            justify-center
            flex-shrink-0
          `}
        >
          <span className={`${selectedColor.text} text-xs`}>{icon}</span>
        </div>

        <span className="text-xs text-slate-500">{label}</span>
      </div>

      <span
        className="
          text-xs
          font-semibold
          text-slate-800
          text-right
          max-w-[150px]
        "
      >
        {value}
      </span>
    </div>
  );
};

export default JobDetails;
