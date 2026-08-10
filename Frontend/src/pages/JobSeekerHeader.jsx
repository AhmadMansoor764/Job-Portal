import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaRegBookmark,
  FaFileAlt,
  FaUser,
  FaHome,
} from "react-icons/fa";

const JobSeekerHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/JobSeekerDashboardTemplate/JobSeekerDashboard"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <FaBriefcase className="text-white" />
            </div>

            <span className="text-xl font-bold text-slate-900">JobPortal</span>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/findjob"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2">
                <FaBriefcase />
                Find Jobs
              </span>
            </Link>

            <Link
              to="/saved-jobs"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2">
                <FaRegBookmark />
                Saved Jobs
              </span>
            </Link>

            <Link
              to="/my-applications"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2">
                <FaFileAlt />
                Applications
              </span>
            </Link>

            <Link
              to="/profile"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2">
                <FaUser />
                Profile
              </span>
            </Link>
          </nav>

          {/* DASHBOARD BUTTON */}
          <button
            onClick={() =>
              navigate("/JobSeekerDashboardTemplate/JobSeekerDashboard")
            }
            className="
              hidden
              lg:flex
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
            <FaHome />
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};

export default JobSeekerHeader;
