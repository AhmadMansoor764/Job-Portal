import { Outlet } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";

const EmployerLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <EmployerSidebar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployerLayout;
