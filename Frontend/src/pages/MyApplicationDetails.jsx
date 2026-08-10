import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  FaHourglassHalf,
  FaTimes,
  FaUserCheck,
  FaPaperPlane,
} from "react-icons/fa";

import { CiBookmark } from "react-icons/ci";

const MyApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH APPLICATION
  // =====================================================

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/my-applications/${id}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch application details",
          );
        }

        setApplication(data.application);
      } catch (error) {
        console.error("Application details error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading application...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <FaTimes className="text-red-500 text-lg" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Application not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "We couldn't find this application."}
          </p>

          <button
            onClick={() => navigate("/my-applications")}
            className="
              mt-6
              px-6
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
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const job = application.job;

  // =====================================================
  // SALARY
  // =====================================================

  const minSalary =
    job?.minSalary !== undefined ? `$${job.minSalary.toLocaleString()}` : null;

  const maxSalary =
    job?.maxSalary !== undefined ? `$${job.maxSalary.toLocaleString()}` : null;

  let salary = "Negotiable";

  if (minSalary && maxSalary) {
    salary = `${minSalary} - ${maxSalary}`;
  } else if (minSalary) {
    salary = minSalary;
  }

  // =====================================================
  // DATES
  // =====================================================

  const appliedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const statusConfig = {
    Applied: {
      label: "Application Submitted",
      description: "Your application has been successfully submitted.",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      icon: <FaPaperPlane />,
    },

    "Under Review": {
      label: "Under Review",
      description: "The employer is currently reviewing your application.",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      iconBg: "bg-amber-100",
      icon: <FaHourglassHalf />,
    },

    Shortlisted: {
      label: "Shortlisted",
      description: "Congratulations! Your application has been shortlisted.",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
      icon: <FaUserCheck />,
    },

    Interview: {
      label: "Interview",
      description: "You have moved forward to the interview stage.",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-100",
      iconBg: "bg-indigo-100",
      icon: <FaBriefcase />,
    },

    Accepted: {
      label: "Accepted",
      description: "Congratulations! Your application has been accepted.",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-100",
      iconBg: "bg-green-100",
      icon: <FaCheck />,
    },

    Rejected: {
      label: "Application Not Selected",
      description:
        "Unfortunately, this application was not selected for the position.",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-100",
      iconBg: "bg-red-100",
      icon: <FaTimes />,
    },
  };

  const currentStatus =
    statusConfig[application.status] || statusConfig.Applied;

  // =====================================================
  // APPLICATION PROGRESS
  // =====================================================

  const progressSteps = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Accepted",
  ];

  const currentIndex = progressSteps.indexOf(application.status);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/my-applications")}
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
            Back to Applications
          </button>

          <button
            onClick={() => navigate(`/jobs/${job?._id}`)}
            className="
              hidden
              sm:flex
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
              transition
            "
          >
            View Job
          </button>
        </div>

        {/* =================================================
            APPLICATION HEADER
        ================================================= */}

        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* JOB INFO */}

              <div className="flex items-start gap-4 min-w-0">
                {/* COMPANY LOGO */}

                <div
                  className="
                    w-14
                    h-14
                    sm:w-16
                    sm:h-16
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    overflow-hidden
                  "
                >
                  {job?.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBuilding className="text-xl text-blue-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-500">
                    {job?.company || "Company"}
                  </p>

                  <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {job?.title || "Job Position"}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-slate-400" />
                      {job?.city}, {job?.country}
                    </span>

                    <span className="hidden sm:inline text-slate-300">•</span>

                    <span className="flex items-center gap-1.5">
                      <FaBriefcase className="text-slate-400" />
                      {job?.jobType || "Job"}
                    </span>
                  </div>
                </div>
              </div>

              {/* STATUS */}

              <div
                className={`
                  inline-flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  border
                  ${currentStatus.bg}
                  ${currentStatus.border}
                  ${currentStatus.text}
                `}
              >
                <div
                  className={`
                    w-9
                    h-9
                    rounded-lg
                    ${currentStatus.iconBg}
                    flex
                    items-center
                    justify-center
                  `}
                >
                  {currentStatus.icon}
                </div>

                <div>
                  <p className="text-sm font-bold">{currentStatus.label}</p>

                  <p className="text-xs opacity-80 mt-0.5">
                    {application.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              STATUS MESSAGE
          ================================================= */}

          <div
            className={`
              border-t
              ${currentStatus.border}
              ${currentStatus.bg}
              px-5
              sm:px-7
              py-4
            `}
          >
            <p className={`text-sm font-medium ${currentStatus.text}`}>
              {currentStatus.description}
            </p>
          </div>
        </section>

        {/* =================================================
            APPLICATION PROGRESS
        ================================================= */}

        {application.status !== "Rejected" && (
          <section className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Application Progress
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Track your application through the hiring process.
                </p>
              </div>

              <span className="hidden sm:block text-xs font-semibold text-slate-400">
                {application.status}
              </span>
            </div>

            <div className="relative">
              {/* DESKTOP LINE */}

              <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />

              <div
                className="hidden sm:block absolute top-5 left-0 h-0.5 bg-blue-600 transition-all"
                style={{
                  width:
                    currentIndex <= 0
                      ? "0%"
                      : `${(currentIndex / (progressSteps.length - 1)) * 100}%`,
                }}
              />

              <div className="grid grid-cols-5 gap-2 relative">
                {progressSteps.map((step, index) => {
                  const completed =
                    currentIndex >= index && currentIndex !== -1;

                  const active = application.status === step;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`
                          w-10
                          h-10
                          rounded-full
                          flex
                          items-center
                          justify-center
                          border-4
                          border-white
                          shadow-sm
                          transition
                          ${
                            completed
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }
                        `}
                      >
                        {completed ? (
                          <FaCheck className="text-xs" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>

                      <p
                        className={`
                          mt-3
                          text-[10px]
                          sm:text-xs
                          font-semibold
                          ${
                            active
                              ? "text-blue-600"
                              : completed
                                ? "text-slate-700"
                                : "text-slate-400"
                          }
                        `}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 mt-6">
          {/* =================================================
              LEFT
          ================================================= */}

          <main className="space-y-6">
            {/* APPLICATION INFORMATION */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">
                Application Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Details about your submitted application.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                <InfoItem
                  label="Application Status"
                  value={application.status}
                  icon={<FaCheck />}
                />

                <InfoItem
                  label="Applied On"
                  value={appliedDate}
                  icon={<FaCalendarAlt />}
                />

                <InfoItem
                  label="Job Type"
                  value={job?.jobType || "Not specified"}
                  icon={<FaBriefcase />}
                />

                <InfoItem
                  label="Work Mode"
                  value={job?.workMode || "Not specified"}
                  icon={<FaLaptopHouse />}
                />

                <InfoItem
                  label="Experience"
                  value={job?.experience || "Not specified"}
                  icon={<FaClock />}
                />

                <InfoItem
                  label="Salary"
                  value={salary}
                  icon={<FaDollarSign />}
                />
              </div>
            </section>

            {/* JOB DESCRIPTION */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">
                Job Description
              </h2>

              <p className="mt-4 text-sm sm:text-[15px] leading-7 text-slate-600 whitespace-pre-line">
                {job?.description || "No description available."}
              </p>
            </section>

            {/* RESPONSIBILITIES */}

            {job?.responsibilities?.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
                <h2 className="text-lg font-bold text-slate-900">
                  Responsibilities
                </h2>

                <ul className="mt-5 space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheck className="text-[9px] text-blue-600" />
                      </span>

                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* REQUIREMENTS */}

            {job?.requirements?.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
                <h2 className="text-lg font-bold text-slate-900">
                  Requirements
                </h2>

                <ul className="mt-5 space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheck className="text-[9px] text-blue-600" />
                      </span>

                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* SKILLS */}

            {job?.skills?.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
                <h2 className="text-lg font-bold text-slate-900">
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-2 mt-5">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="
                        px-3
                        py-1.5
                        rounded-lg
                        bg-slate-100
                        border
                        border-slate-200
                        text-xs
                        font-medium
                        text-slate-600
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

          <aside className="space-y-6">
            {/* APPLICATION SUMMARY */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Application Summary
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryRow label="Status" value={application.status} />

                <SummaryRow label="Applied" value={appliedDate} />

                <SummaryRow
                  label="Location"
                  value={`${job?.city || ""}, ${job?.country || ""}`}
                />

                <SummaryRow
                  label="Work Mode"
                  value={job?.workMode || "Not specified"}
                  last
                />
              </div>

              <button
                onClick={() => navigate(`/jobs/${job?._id}`)}
                className="
                  w-full
                  mt-6
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
                View Original Job
              </button>
            </section>

            {/* COMPANY */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-900">
                About Company
              </h2>

              <div className="flex items-center gap-3 mt-5">
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  {job?.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <FaBuilding className="text-blue-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {job?.company || "Company"}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Technology Company
                  </p>
                </div>
              </div>

              {job?.companyDescription && (
                <p className="text-sm text-slate-500 leading-6 mt-4">
                  {job.companyDescription}
                </p>
              )}

              <button
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
            </section>

            {/* HELP / INFORMATION */}

            <section className="bg-slate-900 rounded-2xl p-5 text-white">
              <h2 className="font-bold">Keep your profile updated</h2>

              <p className="text-sm text-slate-300 leading-6 mt-2">
                A complete profile can help employers better understand your
                skills and experience.
              </p>

              <button
                onClick={() => navigate("/profile")}
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-white
                  hover:text-blue-300
                  transition
                "
              >
                View Profile →
              </button>
            </section>
          </aside>
        </div>

        {/* MOBILE VIEW JOB BUTTON */}

        <button
          onClick={() => navigate(`/jobs/${job?._id}`)}
          className="
            sm:hidden
            w-full
            mt-6
            py-3
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-700
            text-sm
            font-semibold
            hover:border-blue-300
            hover:text-blue-600
            transition
          "
        >
          View Original Job
        </button>
      </div>
    </div>
  );
};

// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-slate-500">{icon}</span>
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="text-sm font-semibold text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
};

// =====================================================
// SUMMARY ROW
// =====================================================

const SummaryRow = ({ label, value, last = false }) => {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        py-3
        ${!last ? "border-b border-slate-100" : ""}
      `}
    >
      <span className="text-xs text-slate-500">{label}</span>

      <span className="text-xs font-semibold text-slate-800 text-right">
        {value}
      </span>
    </div>
  );
};

export default MyApplicationDetails;
