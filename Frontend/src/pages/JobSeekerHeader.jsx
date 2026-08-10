import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaRegBookmark,
  FaFileAlt,
  FaUser,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const JobSeekerHeader = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="relative z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="flex items-center">
            <span className="text-xl font-bold text-slate-900">JobPortal</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
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

          {/* DESKTOP DASHBOARD */}
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

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-lg
              text-slate-700
              hover:bg-slate-100
              transition
            "
            aria-label="Toggle navigation menu"
          >
            <span
              className="
                transition-transform
                duration-300
              "
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </span>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`
            md:hidden
            absolute
            top-20
            left-0
            right-0
            z-50
            bg-white
            border-t
            border-gray-100
            shadow-lg
            origin-top
            transition-all
            duration-300
            ease-out
            ${
              menuOpen
                ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
            }
          `}
        >
          <nav className="px-5 py-4 flex flex-col gap-1">
            {/* Find Jobs */}
            <Link
              to="/findjob"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                text-slate-600
                font-medium
                hover:bg-blue-50
                hover:text-blue-600
                transition
              "
            >
              <FaBriefcase />
              Find Jobs
            </Link>

            {/* Saved Jobs */}
            <Link
              to="/saved-jobs"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                text-slate-600
                font-medium
                hover:bg-blue-50
                hover:text-blue-600
                transition
              "
            >
              <FaRegBookmark />
              Saved Jobs
            </Link>

            {/* Applications */}
            <Link
              to="/my-applications"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                text-slate-600
                font-medium
                hover:bg-blue-50
                hover:text-blue-600
                transition
              "
            >
              <FaFileAlt />
              Applications
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                text-slate-600
                font-medium
                hover:bg-blue-50
                hover:text-blue-600
                transition
              "
            >
              <FaUser />
              Profile
            </Link>

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigate("/JobSeekerDashboardTemplate/JobSeekerDashboard");
              }}
              className="
                mt-2
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-3
                rounded-lg
                bg-blue-600
                text-white
                font-semibold
                hover:bg-blue-700
                transition
              "
            >
              <FaHome />
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default JobSeekerHeader;
