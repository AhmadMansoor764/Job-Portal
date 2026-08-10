import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUserCheck,
  FaBriefcase,
} from "react-icons/fa";

const EmployerShortlisted = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/employer/shortlisted`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch shortlisted candidates",
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Shortlisted error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlisted();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-slate-500">
            Loading shortlisted candidates...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load shortlisted candidates
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
            Shortlisted Candidates
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Review candidates you have shortlisted for your job openings.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Shortlisted"
            value={applications.length}
            icon={<FaUserCheck />}
          />

          <StatCard
            label="Ready for Interview"
            value={applications.length}
            icon={<FaBriefcase />}
          />

          <StatCard
            label="Active Candidates"
            value={applications.length}
            icon={<FaUserCheck />}
          />
        </div>

        {applications.length === 0 ? (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FaUserCheck className="text-2xl" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-5">
              No shortlisted candidates
            </h2>

            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Candidates that you shortlist from your applications will appear
              here.
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
            {applications.map((application) => {
              const applicant = application.user;
              const job = application.job;

              return (
                <section
                  key={application._id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
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
                            {applicant?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          {applicant?.name || "Unknown Candidate"}
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

                    <div className="flex flex-col sm:flex-row gap-3">
                      <span className="px-3 py-2 rounded-lg bg-purple-50 text-purple-600 text-xs font-semibold text-center">
                        Shortlisted
                      </span>

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

                  {job && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FaBriefcase className="text-blue-600" />
                        {job.title}
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        {job.company} · {job.city}, {job.country}
                      </p>
                    </div>
                  )}

                  {applicant?.skills?.length > 0 && (
                    <div className="mt-5">
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
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default EmployerShortlisted;
