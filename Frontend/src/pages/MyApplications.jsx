import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaLaptopHouse,
  FaArrowRight,
  FaRegFileAlt,
  FaUserCheck,
  FaTimesCircle,
  FaVideo,
  FaExternalLinkAlt,
  FaArrowLeft,
} from "react-icons/fa";

import { CiSearch } from "react-icons/ci";

// =====================================================
// STATUS CONFIGURATION
// =====================================================

const statusConfig = {
  Applied: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    dot: "bg-blue-600",
    icon: <FaRegFileAlt />,
  },

  "Under Review": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-500",
    icon: <FaClock />,
  },

  Shortlisted: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
    dot: "bg-purple-600",
    icon: <FaUserCheck />,
  },

  Interview: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
    dot: "bg-indigo-600",
    icon: <FaCalendarAlt />,
  },

  Rejected: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    dot: "bg-red-500",
    icon: <FaTimesCircle />,
  },

  Accepted: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
    dot: "bg-green-600",
    icon: <FaCheck />,
  },
};

// =====================================================
// STATUS ORDER
// =====================================================

const statusOrder = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Accepted",
];

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Applied;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1.5
        rounded-full
        border
        ${config.bg}
        ${config.text}
        ${config.border}
        text-xs
        font-bold
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />

      {status}
    </span>
  );
};

// =====================================================
// INTERVIEW DATE HELPERS
// =====================================================

const getInterviewDateTime = (interview) => {
  if (!interview?.date) {
    return null;
  }

  const date = new Date(interview.date);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  /*
    Your backend currently stores the time separately as a string.

    Example:
    date = 2026-08-13
    time = "16:50"

    We combine them here for countdown/past-interview calculations.
  */

  if (interview.time) {
    const [hours, minutes] = interview.time.split(":").map(Number);

    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      date.setHours(hours, minutes, 0, 0);
    }
  }

  return date;
};

// =====================================================
// INTERVIEW COUNTDOWN
// =====================================================

const getInterviewCountdown = (interview) => {
  const interviewDate = getInterviewDateTime(interview);

  if (!interviewDate) {
    return {
      label: "Interview date not specified",
      type: "unknown",
      days: null,
    };
  }

  const now = new Date();

  const difference = interviewDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      label: "Interview completed",
      type: "past",
      days: 0,
    };
  }

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days === 1) {
    return {
      label: "Interview tomorrow",
      type: "tomorrow",
      days: 1,
    };
  }

  return {
    label: `Interview in ${days} days`,
    type: "upcoming",
    days,
  };
};

// =====================================================
// STATUS PROGRESS
// =====================================================

const ApplicationProgress = ({ status }) => {
  if (status === "Rejected") {
    return (
      <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-100">
        <div className="flex items-center gap-2 text-red-600">
          <FaTimesCircle className="text-sm" />

          <span className="text-sm font-semibold">
            Application was not selected
          </span>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        {statusOrder.map((step, index) => {
          const completed = index <= currentIndex;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`
                    w-7
                    h-7
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-[10px]
                    font-bold
                    transition
                    ${
                      completed
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }
                  `}
                >
                  {completed ? <FaCheck /> : index + 1}
                </div>

                <span
                  className={`
                    mt-2
                    text-[10px]
                    sm:text-xs
                    text-center
                    ${
                      completed
                        ? "text-slate-700 font-semibold"
                        : "text-slate-400"
                    }
                  `}
                >
                  {step}
                </span>
              </div>

              {index < statusOrder.length - 1 && (
                <div
                  className={`
                    h-[2px]
                    flex-1
                    mx-2
                    mb-6
                    ${index < currentIndex ? "bg-blue-600" : "bg-slate-100"}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
  title,
  value,
  description,
  icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition-all
        duration-200
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>

          <p className="text-xs text-slate-400 mt-2">{description}</p>
        </div>

        <div
          className={`
            w-11
            h-11
            rounded-xl
            ${iconBg}
            ${iconColor}
            flex
            items-center
            justify-center
            text-lg
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// UPCOMING INTERVIEW CARD
// =====================================================

const UpcomingInterview = ({ application }) => {
  if (!application?.interview?.scheduled) {
    return null;
  }

  const interview = application.interview;
  const job = application.job;

  if (!job) {
    return null;
  }

  const countdown = getInterviewCountdown(interview);

  const formattedDate = interview.date
    ? new Date(interview.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not specified";

  const isPast = countdown.type === "past";

  return (
    <div
      className={`
        mb-8
        rounded-2xl
        border
        overflow-hidden
        shadow-sm
        ${
          isPast
            ? "bg-slate-50 border-slate-200"
            : "bg-indigo-50 border-indigo-100"
        }
      `}
    >
      {/* HEADER */}

      <div className="px-5 sm:px-6 py-5 border-b border-indigo-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                ${
                  isPast
                    ? "bg-slate-200 text-slate-500"
                    : "bg-indigo-100 text-indigo-600"
                }
              `}
            >
              <FaCalendarAlt className="text-lg" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                {isPast ? "Past Interview" : "Upcoming Interview"}
              </p>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {job.title}
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
            </div>
          </div>

          {/* COUNTDOWN */}

          <div
            className={`
              self-start
              sm:self-auto
              px-4
              py-2
              rounded-xl
              text-sm
              font-bold
              ${
                isPast
                  ? "bg-slate-200 text-slate-600"
                  : countdown.type === "tomorrow"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-indigo-600 text-white"
              }
            `}
          >
            {countdown.label}
          </div>
        </div>
      </div>

      {/* DETAILS */}

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* DATE */}

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FaCalendarAlt className="text-sm" />

              <span className="text-xs">Date</span>
            </div>

            <p className="text-sm font-bold text-slate-800 mt-2">
              {formattedDate}
            </p>
          </div>

          {/* TIME */}

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FaClock className="text-sm" />

              <span className="text-xs">Time</span>
            </div>

            <p className="text-sm font-bold text-slate-800 mt-2">
              {interview.time || "Not specified"}
            </p>
          </div>

          {/* TYPE */}

          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FaVideo className="text-sm" />

              <span className="text-xs">Interview Type</span>
            </div>

            <p className="text-sm font-bold text-slate-800 mt-2">
              {interview.type || "Not specified"}
            </p>
          </div>
        </div>

        {/* ONLINE ACTION */}

        {interview.type === "Online" && interview.meetingLink && (
          <div className="mt-5 bg-white rounded-xl border border-indigo-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Meeting Link</p>

                <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                  {interview.meetingLink}
                </p>
              </div>

              {!isPast && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-xl
                    bg-indigo-600
                    text-white
                    text-sm
                    font-bold
                    shadow-sm
                    hover:bg-indigo-700
                    hover:shadow-md
                    transition
                    flex-shrink-0
                  "
                >
                  Join Interview
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* IN PERSON */}

        {interview.type === "In Person" && interview.location && (
          <div className="mt-5 bg-white rounded-xl border border-indigo-100 p-4">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-indigo-600 mt-1" />

              <div>
                <p className="text-xs text-slate-400">Interview Location</p>

                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {interview.location}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAST INTERVIEW MESSAGE */}

        {isPast && (
          <div className="mt-5 p-4 rounded-xl bg-slate-100 border border-slate-200">
            <p className="text-sm font-semibold text-slate-600">
              This interview has already passed.
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Your application status may be updated by the employer after the
              interview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// INTERVIEW DETAILS
// =====================================================

const InterviewDetails = ({ interview }) => {
  if (!interview?.scheduled) {
    return null;
  }

  const countdown = getInterviewCountdown(interview);

  const formattedDate = interview.date
    ? new Date(interview.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not specified";

  const isPast = countdown.type === "past";

  return (
    <div
      className={`
        mt-6
        rounded-2xl
        border
        overflow-hidden
        ${
          isPast
            ? "border-slate-200 bg-slate-50"
            : "border-indigo-100 bg-indigo-50/60"
        }
      `}
    >
      {/* HEADER */}

      <div className="px-5 py-4 border-b border-indigo-100 flex items-center gap-3">
        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            ${
              isPast
                ? "bg-slate-200 text-slate-500"
                : "bg-indigo-100 text-indigo-600"
            }
          `}
        >
          <FaCalendarAlt />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            {isPast ? "Interview Completed" : "Interview Scheduled"}
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            {isPast
              ? "This scheduled interview time has passed."
              : "Your employer has scheduled an interview for this application."}
          </p>
        </div>
      </div>

      {/* DETAILS */}

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* DATE */}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <FaCalendarAlt className="text-indigo-600 text-sm" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Date</p>

              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* TIME */}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <FaClock className="text-indigo-600 text-sm" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Time</p>

              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {interview.time || "Time not specified"}
              </p>
            </div>
          </div>

          {/* TYPE */}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <FaLaptopHouse className="text-indigo-600 text-sm" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Interview Type</p>

              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {interview.type || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* ONLINE INTERVIEW */}

        {interview.type === "Online" && interview.meetingLink && (
          <div className="mt-5 p-4 rounded-xl bg-white border border-indigo-100">
            <p className="text-[11px] text-slate-400 mb-1">Meeting Link</p>

            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 break-all"
            >
              {interview.meetingLink}
            </a>

            {!isPast && (
              <div className="mt-3">
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-xl
                    bg-indigo-600
                    text-white
                    text-sm
                    font-bold
                    hover:bg-indigo-700
                    transition
                  "
                >
                  Join Interview
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* IN-PERSON */}

        {interview.type === "In Person" && interview.location && (
          <div className="mt-5 p-4 rounded-xl bg-white border border-indigo-100">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-indigo-600 mt-1" />

              <div>
                <p className="text-[11px] text-slate-400">Interview Location</p>

                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {interview.location}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PHONE */}

        {interview.type === "Phone" && (
          <div className="mt-5 p-4 rounded-xl bg-white border border-indigo-100">
            <p className="text-[11px] text-slate-400">Interview Method</p>

            <p className="text-sm font-semibold text-slate-700 mt-1">
              Phone interview
            </p>
          </div>
        )}

        {/* NOTES */}

        {interview.notes && (
          <div className="mt-5">
            <p className="text-[11px] text-slate-400 mb-2">Interview Notes</p>

            <div className="p-4 rounded-xl bg-white border border-indigo-100">
              <p className="text-sm text-slate-600 leading-6 whitespace-pre-line">
                {interview.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// APPLICATION CARD
// =====================================================

const ApplicationCard = ({ application, onViewApplication, onViewJob }) => {
  const job = application.job;

  if (!job) {
    return null;
  }

  const salary =
    job.minSalary !== undefined && job.maxSalary !== undefined
      ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
      : "Negotiable";

  const appliedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-lg
        hover:border-slate-300
        transition-all
        duration-200
      "
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          {/* LEFT */}

          <div className="flex gap-4 min-w-0">
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
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <FaBuilding className="text-xl text-blue-600" />
              )}
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-slate-900
                  truncate
                "
              >
                {job.title}
              </h2>

              <p className="text-sm text-slate-500 mt-1">{job.company}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FaMapMarkerAlt className="text-slate-400" />
                  {job.city}, {job.country}
                </span>

                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <FaBriefcase className="text-slate-400" />
                  {job.jobType}
                </span>
              </div>
            </div>
          </div>

          {/* STATUS */}

          <div className="flex flex-col items-start lg:items-end gap-2">
            <StatusBadge status={application.status} />

            <span className="text-xs text-slate-400">
              Applied {appliedDate}
            </span>
          </div>
        </div>

        {/* JOB DETAILS */}

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            gap-3
            mt-6
            pt-5
            border-t
            border-slate-100
          "
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <FaDollarSign className="text-sm text-slate-500" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Salary</p>

              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {salary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <FaLaptopHouse className="text-sm text-slate-500" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Work Mode</p>

              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {job.workMode || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <FaCalendarAlt className="text-sm text-slate-500" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Applied</p>

              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {appliedDate}
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS */}

        <ApplicationProgress status={application.status} />

        {/* INTERVIEW */}

        <InterviewDetails interview={application.interview} />
      </div>

      {/* FOOTER */}

      <div
        className="
          bg-slate-50
          border-t
          border-slate-100
          px-5
          sm:px-6
          py-4
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
        "
      >
        <p className="text-xs text-slate-500">
          Application ID:{" "}
          <span className="font-medium text-slate-600">{application._id}</span>
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewJob(job._id)}
            className="
              px-4
              py-2
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-600
              text-sm
              font-semibold
              hover:border-blue-300
              hover:text-blue-600
              hover:bg-blue-50
              transition
            "
          >
            View Job
          </button>

          <button
            onClick={() => onViewApplication(application)}
            className="
              px-4
              py-2
              rounded-lg
              bg-blue-600
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              hover:bg-blue-700
              transition
            "
          >
            View Application
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MY APPLICATIONS
// =====================================================

const MyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/my-applications`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // =====================================================
  // UPCOMING INTERVIEW
  // =====================================================

  const upcomingInterview = useMemo(() => {
    const scheduled = applications.filter(
      (application) => application.interview?.scheduled,
    );

    const upcoming = scheduled
      .filter((application) => {
        const date = getInterviewDateTime(application.interview);

        return date && date.getTime() > Date.now();
      })
      .sort((a, b) => {
        const dateA = getInterviewDateTime(a.interview);
        const dateB = getInterviewDateTime(b.interview);

        return dateA - dateB;
      });

    return upcoming[0] || null;
  }, [applications]);

  // =====================================================
  // FILTER APPLICATIONS
  // =====================================================

  const filteredApplications = useMemo(() => {
    if (!search.trim()) {
      return applications;
    }

    const searchValue = search.toLowerCase();

    return applications.filter((application) => {
      const job = application.job;

      if (!job) return false;

      return (
        job.title?.toLowerCase().includes(searchValue) ||
        job.company?.toLowerCase().includes(searchValue) ||
        job.city?.toLowerCase().includes(searchValue) ||
        application.status?.toLowerCase().includes(searchValue)
      );
    });
  }, [applications, search]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    return {
      total: applications.length,

      active: applications.filter(
        (application) =>
          application.status !== "Rejected" &&
          application.status !== "Accepted",
      ).length,

      interviews: applications.filter(
        (application) =>
          application.status === "Interview" ||
          application.status === "Shortlisted",
      ).length,

      rejected: applications.filter(
        (application) => application.status === "Rejected",
      ).length,
    };
  }, [applications]);

  // =====================================================
  // VIEW APPLICATION
  // =====================================================

  const handleViewApplication = (application) => {
    if (application?._id) {
      navigate(`/my-applications/${application._id}`);
    } else {
      navigate("/my-applications");
    }
  };

  // =====================================================
  // VIEW JOB
  // =====================================================

  const handleViewJob = (jobId) => {
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div
            className="
              w-11
              h-11
              border-4
              border-blue-100
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading your applications...
          </p>
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
        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-8
            max-w-md
            w-full
            text-center
          "
        >
          <div
            className="
              w-14
              h-14
              rounded-full
              bg-red-50
              flex
              items-center
              justify-center
              mx-auto
            "
          >
            <FaTimesCircle className="text-xl text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Failed to load applications
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={() => window.location.reload()}
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
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="mb-8">
          {/* ORIGINAL HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-2">
                <FaRegFileAlt />
                <span>Career Dashboard</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                My Applications
              </h1>

              <p className="text-slate-500 mt-2 max-w-xl">
                Keep track of every job you've applied for and follow your
                application progress from submission to final decision.
              </p>
            </div>

            <button
              onClick={() => navigate("/find-jobs")}
              className="
        self-start
        lg:self-auto
        px-5
        py-3
        rounded-xl
        bg-blue-600
        text-white
        text-sm
        font-semibold
        flex
        items-center
        gap-2
        shadow-sm
        hover:bg-blue-700
        hover:shadow-md
        transition
      "
            >
              Find More Jobs
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* =================================================
            UPCOMING INTERVIEW
        ================================================= */}

        {upcomingInterview && (
          <UpcomingInterview application={upcomingInterview} />
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-8
          "
        >
          <SummaryCard
            title="Total Applications"
            value={statistics.total}
            description="Jobs you've applied to"
            icon={<FaRegFileAlt />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <SummaryCard
            title="Active Applications"
            value={statistics.active}
            description="Currently being processed"
            icon={<FaClock />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <SummaryCard
            title="Shortlisted / Interviews"
            value={statistics.interviews}
            description="Positive progress"
            icon={<FaUserCheck />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <SummaryCard
            title="Rejected"
            value={statistics.rejected}
            description="Applications not selected"
            icon={<FaTimesCircle />}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* =================================================
            APPLICATIONS SECTION
        ================================================= */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >
          {/* SECTION HEADER */}

          <div
            className="
              px-5
              sm:px-6
              py-5
              border-b
              border-slate-200
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            "
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">Applications</h2>

              <p className="text-sm text-slate-500 mt-1">
                {applications.length}{" "}
                {applications.length === 1 ? "application" : "applications"} in
                total
              </p>
            </div>

            {applications.length > 0 && (
              <div
                className="
                  flex
                  items-center
                  w-full
                  md:w-72
                  h-11
                  border
                  border-slate-200
                  rounded-xl
                  px-3
                  focus-within:border-blue-500
                  focus-within:ring-4
                  focus-within:ring-blue-50
                  transition
                "
              >
                <CiSearch className="text-xl text-slate-400 flex-shrink-0" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search applications..."
                  className="
                    w-full
                    ml-2
                    outline-none
                    bg-transparent
                    text-sm
                    text-slate-700
                    placeholder:text-slate-400
                  "
                />
              </div>
            )}
          </div>

          {/* EMPTY */}

          {applications.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div
                className="
                  w-20
                  h-20
                  rounded-2xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
              >
                <FaRegFileAlt className="text-3xl text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-6">
                No applications yet
              </h2>

              <p className="text-slate-500 max-w-md mx-auto mt-2">
                You haven't applied to any jobs yet. Explore available
                opportunities and submit your first application.
              </p>

              <button
                onClick={() => navigate("/find-jobs")}
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
                Explore Jobs
              </button>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div
                className="
                  w-16
                  h-16
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
              >
                <CiSearch className="text-3xl text-slate-400" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-5">
                No applications found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Try searching with a different job title, company, location, or
                status.
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-5 space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onViewApplication={handleViewApplication}
                  onViewJob={handleViewJob}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
