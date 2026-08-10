import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaPlus,
  FaCalendarAlt,
  FaStar,
  FaBuilding,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaBars,
  FaTachometerAlt,
} from "react-icons/fa";

const EmployerSidebar = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    {
      label: "Dashboard",
      path: "/employer/dashboard",
      icon: FaTachometerAlt,
    },
    {
      label: "My Jobs",
      path: "/employer/jobs",
      icon: FaBriefcase,
    },
    {
      label: "Post a Job",
      path: "/employer/jobs/create",
      icon: FaPlus,
    },
    {
      label: "Applicants",
      path: "/employer/applicants",
      icon: FaUsers,
    },
    {
      label: "Interviews",
      path: "/employer/interviews",
      icon: FaCalendarAlt,
    },
    {
      label: "Shortlisted",
      path: "/employer/shortlisted",
      icon: FaStar,
    },
    {
      label: "Company Profile",
      path: "/employer/profile",
      icon: FaBuilding,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login");
    }
  };

  const NavigationItem = ({ item }) => {
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) => `
          group
          relative
          flex
          items-center
          ${collapsed ? "justify-center" : "gap-3"}
          px-3
          py-3
          rounded-xl
          text-sm
          font-semibold
          transition-all
          duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }
        `}
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`text-[15px] flex-shrink-0 ${
                isActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
              }`}
            />

            {!collapsed && <span>{item.label}</span>}

            {collapsed && (
              <div
                className="
                  absolute
                  left-full
                  ml-3
                  px-3
                  py-2
                  rounded-lg
                  bg-slate-900
                  text-white
                  text-xs
                  whitespace-nowrap
                  opacity-0
                  pointer-events-none
                  group-hover:opacity-100
                  transition
                  z-50
                "
              >
                {item.label}
              </div>
            )}
          </>
        )}
      </NavLink>
    );
  };

  const SidebarContent = ({ mobile = false }) => {
    const isCollapsed = mobile ? false : collapsed;

    return (
      <div className="h-full flex flex-col">
        {/* BRAND */}
        <div
          className={`
            h-20
            flex
            items-center
            ${isCollapsed ? "justify-center px-3" : "justify-between px-5"}
            border-b
            border-slate-100
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                flex-shrink-0
                shadow-sm
              "
            >
              <FaBriefcase className="text-sm" />
            </div>

            {!isCollapsed && (
              <div className="text-left">
                <p className="text-sm font-extrabold text-slate-900">
                  Job<span className="text-blue-600">Portal</span>
                </p>

                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Employer platform
                </p>
              </div>
            )}
          </div>

          {mobile && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                w-9
                h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-400
                hover:bg-slate-100
                hover:text-slate-700
              "
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* EMPLOYER MINI PROFILE */}
        {!isCollapsed && (
          <div className="px-4 pt-5">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  <FaBuilding className="text-sm" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    Employer
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Your hiring space
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 pt-6 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Hiring Workspace
            </p>
          )}

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavigationItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* POST JOB CTA */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white">
              <p className="text-sm font-bold">Find great candidates</p>

              <p className="text-xs text-blue-100 leading-5 mt-1">
                Post your next job and connect with talented candidates.
              </p>

              <button
                type="button"
                onClick={() => {
                  navigate("/employer/jobs/create");
                  setMobileOpen(false);
                }}
                className="
                  mt-3
                  text-xs
                  font-bold
                  bg-white
                  text-blue-600
                  px-3
                  py-2
                  rounded-lg
                  hover:bg-blue-50
                  transition
                "
              >
                Post a Job
              </button>
            </div>
          </div>
        )}
        {/* BOTTOM */}
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`
              group
              w-full
              flex
              items-center
              ${isCollapsed ? "justify-center" : "gap-3"}
              px-3
              py-3
              rounded-xl
              text-sm
              font-semibold
              text-slate-500
              hover:bg-red-50
              hover:text-red-600
              transition
            `}
          >
            <FaSignOutAlt className="text-sm flex-shrink-0" />

            {!isCollapsed && <span>Logout</span>}
          </button>

          {!mobile && (
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="
                mt-1
                w-full
                flex
                items-center
                justify-center
                py-2
                rounded-lg
                text-slate-400
                hover:bg-slate-100
                hover:text-slate-700
                transition
              "
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div
        className="
          lg:hidden
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-white
          border-b
          border-slate-200
          z-40
          flex
          items-center
          justify-between
          px-4
        "
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <FaBriefcase className="text-xs" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-900">
              Job<span className="text-blue-600">Portal</span>
            </p>

            <p className="text-[9px] uppercase tracking-wider text-slate-400">
              Employer
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            w-10
            h-10
            rounded-xl
            bg-slate-100
            text-slate-600
            flex
            items-center
            justify-center
          "
        >
          <FaBars />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
          hidden
          lg:block
          h-screen
          sticky
          top-0
          bg-white
          border-r
          border-slate-200
          flex-shrink-0
          transition-all
          duration-300
          ${collapsed ? "w-[76px]" : "w-[260px]"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <>
          <div
            className="
              lg:hidden
              fixed
              inset-0
              bg-slate-900/40
              backdrop-blur-sm
              z-40
            "
            onClick={() => setMobileOpen(false)}
          />

          <aside
            className="
              lg:hidden
              fixed
              top-0
              left-0
              bottom-0
              w-[280px]
              bg-white
              z-50
              shadow-2xl
            "
          >
            <SidebarContent mobile />
          </aside>
        </>
      )}
    </>
  );
};

export default EmployerSidebar;
