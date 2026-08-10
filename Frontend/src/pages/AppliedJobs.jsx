import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLaptopHouse,
  FaDollarSign,
  FaBuilding,
  FaArrowRight,
  FaFileAlt,
} from "react-icons/fa";

const AppliedJobs = () => {
  const navigate = useNavigate();

  // Temporary sample application data.
  // Later this will come from MongoDB.
  const [applications] = useState([
    {
      jobId: jobs[0].id,
      appliedAt: "Today",
      status: "Under Review",
    },
    {
      jobId: jobs[1].id,
      appliedAt: "2 days ago",
      status: "Shortlisted",
    },
    {
      jobId: jobs[2].id,
      appliedAt: "5 days ago",
      status: "Rejected",
    },
    {
      jobId: jobs[3].id,
      appliedAt: "7 days ago",
      status: "Applied",
    },
  ]);

  const getJob = (jobId) => {
    return jobs.find((job) => job.id === jobId);
  };

  const openJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return {
          container: "bg-green-50 border-green-100",
          text: "text-green-700",
          icon: <FaCheckCircle />,
        };

      case "Under Review":
        return {
          container: "bg-blue-50 border-blue-100",
          text: "text-blue-700",
          icon: <FaClock />,
        };

      case "Rejected":
        return {
          container: "bg-red-50 border-red-100",
          text: "text-red-700",
          icon: <FaTimesCircle />,
        };

      default:
        return {
          container: "bg-slate-50 border-slate-200",
          text: "text-slate-600",
          icon: <FaFileAlt />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FaFileAlt className="text-indigo-600" />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Applied Jobs
              </h1>

              <p className="text-slate-500 mt-1">
                Track the jobs you've applied for.
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Applications</p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {applications.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Under Review</p>

            <p className="text-2xl font-bold text-blue-600 mt-2">
              {
                applications.filter((app) => app.status === "Under Review")
                  .length
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Shortlisted</p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              {
                applications.filter((app) => app.status === "Shortlisted")
                  .length
              }
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Rejected</p>

            <p className="text-2xl font-bold text-red-600 mt-2">
              {applications.filter((app) => app.status === "Rejected").length}
            </p>
          </div>
        </div>

        {/* APPLICATIONS */}

        <div className="space-y-4">
          {applications.map((application) => {
            const job = getJob(application.jobId);

            if (!job) return null;

            const statusStyle = getStatusStyle(application.status);

            return (
              <div
                key={application.jobId}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-5
                  sm:p-6
                  shadow-sm
                  hover:shadow-lg
                  hover:border-indigo-200
                  transition-all
                "
              >
                {/* TOP */}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                  <div className="flex gap-4 min-w-0">
                    {/* COMPANY */}

                    <div
                      className="
                        w-14
                        h-14
                        rounded-xl
                        bg-indigo-50
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >
                      <FaBuilding className="text-2xl text-indigo-600" />
                    </div>

                    {/* INFORMATION */}

                    <div className="min-w-0">
                      <button
                        onClick={() => openJob(job.id)}
                        className="
                          text-left
                          text-lg
                          sm:text-xl
                          font-bold
                          text-slate-900
                          hover:text-indigo-600
                          transition
                        "
                      >
                        {job.title}
                      </button>

                      <p className="text-sm text-slate-500 mt-1">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-slate-400" />
                          {job.location}
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

                  {/* STATUS */}

                  <div
                    className={`
                      flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      border
                      text-xs
                      font-semibold
                      self-start
                      ${statusStyle.container}
                      ${statusStyle.text}
                    `}
                  >
                    {statusStyle.icon}

                    {application.status}
                  </div>
                </div>

                {/* BOTTOM */}

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <div className="flex flex-wrap gap-3">
                    {/* SALARY */}

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700">
                      <FaDollarSign />

                      <span className="text-sm font-semibold">
                        ${job.minSalary?.toLocaleString()} - $
                        {job.maxSalary?.toLocaleString()}
                      </span>
                    </div>

                    {/* APPLIED DATE */}

                    <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm">
                      Applied {application.appliedAt}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex justify-end mt-5">
                    <button
                      onClick={() => openJob(job.id)}
                      className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-xl
                        bg-indigo-600
                        text-white
                        font-semibold
                        text-sm
                        hover:bg-indigo-700
                        transition
                      "
                    >
                      View Job
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;
