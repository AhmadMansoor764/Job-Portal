import { Outlet } from "react-router-dom";
import UserSideBar from "./UserSideBar";

const JobSeekerDashboardTemplate = () => {
  return (
    <div className="h-screen bg-slate-50 overflow-hidden flex">
      {/* SIDEBAR */}

      <UserSideBar />

      {/* MAIN AREA */}

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* Mobile spacing for mobile header */}

        <div className="lg:hidden h-16" />

        <Outlet />
      </main>
    </div>
  );
};

export default JobSeekerDashboardTemplate;
