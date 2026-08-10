import { Outlet } from "react-router-dom";
import JobSeekerHeader from "./JobSeekerHeader";

const JobSeekerPageLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <JobSeekerHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default JobSeekerPageLayout;
