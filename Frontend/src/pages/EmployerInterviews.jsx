import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaBriefcase,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const EmployerInterviews = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8000/api/applications/employer/interviews",
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interviews");
        }

        setInterviews(data.interviews || []);
      } catch (error) {
        console.error("Interviews error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const completeInterview = async (id) => {
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
        throw new Error(data.message || "Failed to complete interview");
      }

      setInterviews((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Accepted" } : item,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const cancelInterview = async (id) => {
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

      setInterviews((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Shortlisted" } : item,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:hidden h-16" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-10">
        <button
          onClick={() => navigate("/employer/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition mb-6"
        >
          <FaArrowLeft className="text-xs" />
          Back to Dashboard
        </button>

        <header className="mb-8">
          <p className="text-sm font-bold text-blue-600">
            Candidate Management
          </p>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Interviews
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Manage scheduled interviews with your candidates.
          </p>
        </header>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {interviews.length === 0 ? (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FaCalendarAlt className="text-2xl" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-5">
              No interviews scheduled
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Interviews that you schedule with shortlisted candidates will
              appear here.
            </p>

            <button
              onClick={() => navigate("/employer/applicants")}
              className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              View Applicants
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => {
              const applicant = interview.user;
              const job = interview.job;

              return (
                <section
                  key={interview._id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FaUser className="text-xl" />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          {applicant?.name || "Unknown Candidate"}
                        </h2>

                        <p className="text-sm text-blue-600 mt-1">
                          {job?.title || "Job"}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt />
                            {interview.interviewDate
                              ? new Date(
                                  interview.interviewDate,
                                ).toLocaleDateString()
                              : "Date not set"}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <FaClock />
                            {interview.interviewTime || "Time not set"}
                          </span>

                          {job?.company && (
                            <span className="flex items-center gap-1.5">
                              <FaBriefcase />
                              {job.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => completeInterview(interview._id)}
                        className="px-3 py-2 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 transition flex items-center gap-2"
                      >
                        <FaCheck />
                        Complete
                      </button>

                      <button
                        onClick={() => cancelInterview(interview._id)}
                        className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition flex items-center gap-2"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
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

export default EmployerInterviews;
