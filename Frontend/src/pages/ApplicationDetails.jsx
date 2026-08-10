import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBriefcase,
  FaEnvelope,
  FaGithub,
  FaGraduationCap,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaFileAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaVideo,
  FaTimes,
  FaClock,
  FaUser,
  FaCode,
  FaBuilding,
} from "react-icons/fa";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    type: "Online",
    meetingLink: "",
    location: "",
    notes: "",
  });

  // =====================================================
  // FETCH APPLICATION
  // =====================================================

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/api/applications/employer/${id}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch application");
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
  // STATUS
  // =====================================================

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `http://localhost:8000/api/applications/employer/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update application status");
      }

      setApplication(data.application);
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // INTERVIEW
  // =====================================================

  const openInterviewModal = () => {
    if (application.interview?.scheduled) {
      setInterviewForm({
        date: application.interview.date
          ? new Date(application.interview.date).toISOString().split("T")[0]
          : "",
        time: application.interview.time || "",
        type: application.interview.type || "Online",
        meetingLink: application.interview.meetingLink || "",
        location: application.interview.location || "",
        notes: application.interview.notes || "",
      });
    } else {
      setInterviewForm({
        date: "",
        time: "",
        type: "Online",
        meetingLink: "",
        location: "",
        notes: "",
      });
    }

    setShowInterviewModal(true);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();

    try {
      setSchedulingInterview(true);

      const response = await fetch(
        `http://localhost:8000/api/applications/employer/${id}/interview`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(interviewForm),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to schedule interview");
      }

      setApplication(data.application);
      setShowInterviewModal(false);

      alert("Interview scheduled successfully!");
    } catch (error) {
      console.error("Schedule interview error:", error);
      alert(error.message);
    } finally {
      setSchedulingInterview(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!window.confirm("Mark this interview as completed?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/applications/employer/${id}/interview/complete`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark interview as completed",
        );
      }

      setApplication(data.application);
      alert("Interview marked as completed.");
    } catch (error) {
      console.error("Complete interview error:", error);
      alert(error.message);
    }
  };

  const handleCancelInterview = async () => {
    if (!window.confirm("Are you sure you want to cancel this interview?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/applications/employer/${id}/interview/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel interview");
      }

      setApplication(data.application);
      alert("Interview cancelled.");
    } catch (error) {
      console.error("Cancel interview error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading applicant...</p>
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
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <FaTimes className="text-red-500 text-xl" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Unable to load applicant
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const applicant = application.user;
  const job = application.job;

  const interviewStatus = application.interview?.status || "Not Scheduled";

  const isScheduled = interviewStatus === "Scheduled";
  const isCompleted = interviewStatus === "Completed";
  const isCancelled = interviewStatus === "Cancelled";

  const applicationCvUrl =
    application.cvUrl ||
    application.resumeUrl ||
    application.cv?.url ||
    application.resume?.url ||
    "";

  const applicationCvName =
    application.cvFileName ||
    application.resumeFileName ||
    application.cv?.fileName ||
    application.resume?.fileName ||
    "Submitted CV";

  const profileResumeUrl = applicant?.resume?.url || "";

  const profileResumeName =
    applicant?.resume?.fileName || "Candidate Profile Resume";

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-6"
        >
          <FaArrowLeft className="text-xs" />
          Back to Applicants
        </button>

        {/* =====================================================
            CANDIDATE HEADER
        ===================================================== */}

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {/* TOP ACCENT */}

          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">
              {/* CANDIDATE */}

              <div className="flex items-start gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-50 border border-blue-100 overflow-hidden flex items-center justify-center shrink-0">
                  {applicant?.profileImage ? (
                    <img
                      src={applicant.profileImage}
                      alt={applicant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {applicant?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {applicant?.name || "Unknown Applicant"}
                    </h1>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      Applicant
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-blue-600 font-medium mt-1">
                    {applicant?.headline || "Professional Candidate"}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-slate-500">
                    {applicant?.location && (
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-slate-400" />
                        {applicant.location}
                      </span>
                    )}

                    {applicant?.email && (
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="text-slate-400" />
                        {applicant.email}
                      </span>
                    )}

                    {applicant?.phone && (
                      <span className="flex items-center gap-2">
                        <FaPhone className="text-slate-400" />
                        {applicant.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* EMPLOYER ACTIONS */}

              <div className="w-full xl:w-auto">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Application Status
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                    className="min-w-[190px] px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {application.status !== "Rejected" &&
                    application.status !== "Accepted" && (
                      <button
                        onClick={openInterviewModal}
                        disabled={isCompleted}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        <FaCalendarAlt />

                        {isCompleted
                          ? "Interview Completed"
                          : isScheduled
                            ? "Edit Interview"
                            : "Schedule Interview"}
                      </button>
                    )}
                </div>

                {updatingStatus && (
                  <p className="text-xs text-slate-400 mt-2">
                    Updating application status...
                  </p>
                )}
              </div>
            </div>

            {/* APPLICATION CONTEXT */}

            <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Applied Position
                </p>

                <div className="flex items-center gap-2 mt-1.5">
                  <FaBriefcase className="text-blue-500" />

                  <span className="font-semibold text-slate-800">
                    {job?.title || "-"}
                  </span>

                  <span className="text-slate-300">•</span>

                  <span className="text-sm text-slate-500">
                    {job?.company || "-"}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Applied
                </p>

                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 mt-6">
          <main className="space-y-6">
            {/* =====================================================
                CV
            ===================================================== */}

            <SectionCard
              title="Submitted CV"
              subtitle="The resume submitted with this application"
              icon={<FaFileAlt />}
            >
              {applicationCvUrl ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <FaFileAlt className="text-red-500 text-xl" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {applicationCvName}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Submitted with this application
                      </p>
                    </div>
                  </div>

                  <a
                    href={applicationCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    <FaFileAlt />
                    View CV
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              ) : (
                <EmptyMessage text="No CV was attached to this application." />
              )}
            </SectionCard>

            {/* =====================================================
                COVER LETTER
            ===================================================== */}

            {application.coverLetter && (
              <SectionCard
                title="Cover Letter"
                subtitle="Message submitted by the applicant"
              >
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
                  <p className="text-sm text-slate-600 leading-7 whitespace-pre-line">
                    {application.coverLetter}
                  </p>
                </div>
              </SectionCard>
            )}

            {/* =====================================================
                INTERVIEW
            ===================================================== */}

            {application.interview && (
              <SectionCard
                title="Interview"
                subtitle="Interview details and employer actions"
                icon={<FaCalendarAlt />}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : isCancelled
                            ? "bg-red-100 text-red-600"
                            : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {isCompleted ? (
                        <FaCheckCircle />
                      ) : isCancelled ? (
                        <FaTimes />
                      ) : (
                        <FaCalendarAlt />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {isCompleted
                          ? "Interview Completed"
                          : isCancelled
                            ? "Interview Cancelled"
                            : "Interview Scheduled"}
                      </p>

                      <span
                        className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-600"
                            : isCancelled
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {interviewStatus}
                      </span>
                    </div>
                  </div>

                  {isScheduled && (
                    <div className="flex flex-wrap gap-2">
                      {application.interview.meetingLink && (
                        <a
                          href={application.interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                        >
                          <FaVideo />
                          Join
                        </a>
                      )}

                      <button
                        onClick={openInterviewModal}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                      >
                        <FaCalendarAlt />
                        Edit
                      </button>

                      <button
                        onClick={handleCompleteInterview}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                      >
                        <FaCheckCircle />
                        Complete
                      </button>

                      <button
                        onClick={handleCancelInterview}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <DetailBox
                    label="Date"
                    value={
                      application.interview.date
                        ? new Date(
                            application.interview.date,
                          ).toLocaleDateString()
                        : "-"
                    }
                    icon={<FaCalendarAlt />}
                  />

                  <DetailBox
                    label="Time"
                    value={application.interview.time || "-"}
                    icon={<FaClock />}
                  />

                  <DetailBox
                    label="Interview Type"
                    value={application.interview.type || "-"}
                    icon={<FaVideo />}
                  />

                  {application.interview.location && (
                    <DetailBox
                      label="Location"
                      value={application.interview.location}
                      icon={<FaMapMarkerAlt />}
                    />
                  )}
                </div>

                {application.interview.notes && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Interview Notes
                    </p>

                    <p className="text-sm text-slate-600 leading-7 mt-2 whitespace-pre-line">
                      {application.interview.notes}
                    </p>
                  </div>
                )}

                {isCompleted && application.interview.completedAt && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <FaCheckCircle className="text-emerald-600 mt-0.5" />

                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        Interview completed
                      </p>

                      <p className="text-xs text-emerald-700 mt-1">
                        Completed on{" "}
                        {new Date(
                          application.interview.completedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {isCancelled && application.interview.cancelledAt && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <FaTimes className="text-red-600 mt-0.5" />

                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Interview cancelled
                      </p>

                      <p className="text-xs text-red-700 mt-1">
                        Cancelled on{" "}
                        {new Date(
                          application.interview.cancelledAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* =====================================================
                ABOUT
            ===================================================== */}

            <SectionCard title="About" subtitle="Professional summary">
              <p className="text-sm text-slate-600 leading-7">
                {applicant?.bio ||
                  "This applicant has not added a professional summary yet."}
              </p>
            </SectionCard>

            {/* =====================================================
                SKILLS
            ===================================================== */}

            <SectionCard
              title="Skills"
              subtitle="Technical and professional skills"
              icon={<FaCode />}
            >
              {applicant?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyMessage text="No skills added." />
              )}
            </SectionCard>

            {/* =====================================================
                EXPERIENCE
            ===================================================== */}

            <SectionCard
              title="Experience"
              subtitle="Professional work experience"
            >
              {applicant?.experience?.length > 0 ? (
                <div className="space-y-7">
                  {applicant.experience.map((experience) => (
                    <div
                      key={experience._id}
                      className="relative pl-6 border-l-2 border-blue-100"
                    >
                      <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />

                      <h3 className="font-bold text-slate-900">
                        {experience.jobTitle}
                      </h3>

                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {experience.company}
                      </p>

                      {experience.location && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <FaMapMarkerAlt />
                          {experience.location}
                        </p>
                      )}

                      {experience.description && (
                        <p className="text-sm text-slate-600 leading-7 mt-3">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyMessage text="No experience added." />
              )}
            </SectionCard>

            {/* =====================================================
                PROJECTS
            ===================================================== */}

            <SectionCard
              title="Projects"
              subtitle="Projects and work completed by the applicant"
            >
              {applicant?.projects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applicant.projects.map((project) => (
                    <div
                      key={project._id}
                      className="group border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold text-slate-900">
                          {project.title}
                        </h3>

                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <FaCode className="text-blue-600 text-sm" />
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-6 mt-3">
                        {project.description}
                      </p>

                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.technologies.map((technology, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}

                      {(project.liveUrl || project.githubUrl) && (
                        <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              Live Demo
                              <FaExternalLinkAlt className="text-xs" />
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                            >
                              <FaGithub />
                              GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyMessage text="No projects added." />
              )}
            </SectionCard>

            {/* =====================================================
                EDUCATION
            ===================================================== */}

            <SectionCard
              title="Education"
              subtitle="Academic background"
              icon={<FaGraduationCap />}
            >
              {applicant?.education?.length > 0 ? (
                <div className="space-y-5">
                  {applicant.education.map((education) => (
                    <div
                      key={education._id}
                      className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FaGraduationCap className="text-blue-600" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {education.degree}
                        </h3>

                        <p className="text-sm font-medium text-blue-600 mt-1">
                          {education.institution}
                        </p>

                        {education.fieldOfStudy && (
                          <p className="text-sm text-slate-500 mt-1">
                            {education.fieldOfStudy}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyMessage text="No education added." />
              )}
            </SectionCard>
          </main>

          {/* =====================================================
              SIDEBAR
          ===================================================== */}

          {/* =====================================================
    SIDEBAR
===================================================== */}

          <aside className="lg:sticky lg:top-6 self-start space-y-5">
            {/* =====================================================
      APPLICATION SUMMARY
  ===================================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-slate-900">Application</h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  label="Position"
                  value={job?.title}
                  icon={<FaBriefcase />}
                />

                <InfoRow
                  label="Company"
                  value={job?.company}
                  icon={<FaBriefcase />}
                />

                <InfoRow
                  label="Applied"
                  value={
                    application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : "-"
                  }
                  icon={<FaCalendarAlt />}
                />

                <InfoRow
                  label="Status"
                  value={application.status}
                  icon={<FaCheckCircle />}
                />
              </div>
            </div>

            {/* =====================================================
      INTERVIEW / SCHEDULE
  ===================================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <FaCalendarAlt className="text-indigo-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Interview</h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage applicant interview
                  </p>
                </div>
              </div>

              {application.interview?.scheduled ? (
                <div className="mt-5">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        Status
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          application.interview.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : application.interview.status === "Cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {application.interview.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Date</p>

                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                          {application.interview.date
                            ? new Date(
                                application.interview.date,
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Time</p>

                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                          {application.interview.time || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Type</p>

                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                          {application.interview.type || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* JOIN */}

                  {application.interview.meetingLink &&
                    application.interview.status === "Scheduled" && (
                      <a
                        href={application.interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <FaVideo />
                        Join Interview
                      </a>
                    )}

                  {/* EDIT */}

                  {application.interview.status === "Scheduled" && (
                    <button
                      type="button"
                      onClick={() => {
                        setInterviewForm({
                          date: application.interview.date
                            ? new Date(application.interview.date)
                                .toISOString()
                                .split("T")[0]
                            : "",

                          time: application.interview.time || "",

                          type: application.interview.type || "Online",

                          meetingLink: application.interview.meetingLink || "",

                          location: application.interview.location || "",

                          notes: application.interview.notes || "",
                        });

                        setShowInterviewModal(true);
                      }}
                      className="w-full mt-2.5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition"
                    >
                      <FaCalendarAlt />
                      Edit Interview
                    </button>
                  )}

                  {/* COMPLETE */}

                  {application.interview.status === "Scheduled" && (
                    <button
                      type="button"
                      onClick={handleCompleteInterview}
                      className="w-full mt-2.5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
                    >
                      <FaCheckCircle />
                      Mark Completed
                    </button>
                  )}

                  {/* CANCEL */}

                  {application.interview.status === "Scheduled" && (
                    <button
                      type="button"
                      onClick={handleCancelInterview}
                      className="w-full mt-2.5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                    >
                      <FaTimes />
                      Cancel Interview
                    </button>
                  )}
                </div>
              ) : (
                /* NO INTERVIEW */

                <div className="mt-5">
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <FaCalendarAlt className="text-slate-400" />
                    </div>

                    <p className="text-sm font-semibold text-slate-700 mt-3">
                      No interview scheduled
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Schedule an interview with this applicant.
                    </p>
                  </div>

                  {application.status !== "Rejected" &&
                    application.status !== "Accepted" && (
                      <button
                        type="button"
                        onClick={() => {
                          setInterviewForm({
                            date: "",
                            time: "",
                            type: "Online",
                            meetingLink: "",
                            location: "",
                            notes: "",
                          });

                          setShowInterviewModal(true);
                        }}
                        className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <FaCalendarAlt />
                        Schedule Interview
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* =====================================================
      PROFESSIONAL LINKS
  ===================================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-slate-900">Professional Links</h2>

              <div className="mt-4 space-y-2">
                {applicant?.linkedinUrl && (
                  <ExternalLink
                    icon={<FaLinkedin />}
                    label="LinkedIn"
                    href={applicant.linkedinUrl}
                  />
                )}

                {applicant?.githubUrl && (
                  <ExternalLink
                    icon={<FaGithub />}
                    label="GitHub"
                    href={applicant.githubUrl}
                  />
                )}

                {applicant?.portfolioUrl && (
                  <ExternalLink
                    icon={<FaGlobe />}
                    label="Portfolio"
                    href={applicant.portfolioUrl}
                  />
                )}

                {!applicant?.linkedinUrl &&
                  !applicant?.githubUrl &&
                  !applicant?.portfolioUrl && (
                    <p className="text-sm text-slate-500">
                      No professional links added.
                    </p>
                  )}
              </div>
            </div>

            {/* =====================================================
      PROFILE RESUME
  ===================================================== */}

            {profileResumeUrl && (
              <div className="bg-slate-900 rounded-2xl p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <FaFileAlt className="text-blue-300" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold">Profile Resume</h2>

                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {profileResumeName}
                    </p>
                  </div>
                </div>

                <a
                  href={profileResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-4 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition"
                >
                  View Profile Resume
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* =====================================================
          INTERVIEW MODAL
      ===================================================== */}

      {showInterviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            {/* HEADER */}

            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {application.interview?.scheduled &&
                  application.interview?.status === "Scheduled"
                    ? "Edit Interview"
                    : "Schedule Interview"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {application.interview?.scheduled &&
                  application.interview?.status === "Scheduled"
                    ? `Update the interview for ${applicant?.name}.`
                    : `Schedule an interview with ${applicant?.name}.`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleScheduleInterview} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Interview Date">
                  <input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        date: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Interview Time">
                  <input
                    type="time"
                    required
                    value={interviewForm.time}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        time: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </FormField>
              </div>

              <FormField label="Interview Type">
                <select
                  value={interviewForm.type}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      type: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  <option value="Online">Online</option>
                  <option value="In Person">In Person</option>
                  <option value="Phone">Phone</option>
                </select>
              </FormField>

              {interviewForm.type === "Online" && (
                <FormField label="Meeting Link">
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={interviewForm.meetingLink}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        meetingLink: e.target.value,
                      })
                    }
                    className="form-input"
                  />

                  <p className="text-xs text-slate-400 mt-1.5">
                    Google Meet, Zoom, Microsoft Teams, or another meeting
                    platform.
                  </p>
                </FormField>
              )}

              {interviewForm.type === "In Person" && (
                <FormField label="Interview Location">
                  <input
                    type="text"
                    placeholder="Office address or location"
                    value={interviewForm.location}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        location: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </FormField>
              )}

              <FormField label="Interview Notes">
                <textarea
                  rows="4"
                  placeholder="Add instructions or notes for the applicant..."
                  value={interviewForm.notes}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      notes: e.target.value,
                    })
                  }
                  className="form-input resize-none"
                />
              </FormField>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={schedulingInterview}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {schedulingInterview
                    ? "Saving..."
                    : application.interview?.scheduled &&
                        application.interview?.status === "Scheduled"
                      ? "Update Interview"
                      : "Schedule Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// COMPONENTS
// =====================================================

const SectionCard = ({ title, subtitle, icon, children }) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-7 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>

            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
};

const DetailBox = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        {icon}
        {label}
      </div>

      <p className="text-sm font-semibold text-slate-800 mt-2">{value}</p>
    </div>
  );
};

const InfoRow = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="text-sm font-semibold text-slate-700 mt-0.5 break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

const ExternalLink = ({ icon, label, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>

      <FaExternalLinkAlt className="text-xs text-slate-300" />
    </a>
  );
};

const EmptyMessage = ({ text }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
      {text}
    </div>
  );
};

const FormField = ({ label, children }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      {children}
    </div>
  );
};

export default ApplicationDetails;
