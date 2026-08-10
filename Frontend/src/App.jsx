import { Routes, Route } from "react-router-dom";

import JobSeekerPageLayout from "./pages/JobSeekerPageLayout";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AccountType from "./pages/AccountType";
import SignupEmployer from "./pages/SignUpEmployer";
import CompleteProfile from "./pages/CompleteProfile";
import JobSeekerCompleteProfile from "./pages/JobSeekerCompleteProfile";

import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobSeekerDashboardTemplate from "./pages/JobSeekerDashboardTemplate";

import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import AppliedJobs from "./pages/AppliedJobs";
import CreateJob from "./pages/CreateJob";
import MyApplications from "./pages/MyApplications";
import MyApplicationDetails from "./pages/MyApplicationDetails";

import JobSeekerProfile from "./pages/JobSeekerProfile";
import EditProfile from "./pages/EditProfile";

import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import JobApplicants from "./pages/JobApplicants";
import ApplicationDetails from "./pages/ApplicationDetails";

import EmployerProfile from "./pages/EmployerProfile";
import EditEmployerProfile from "./pages/EditEmployerProfile";

import ApplyJob from "./pages/ApplyJob";

import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerLayout from "./pages/EmployerLayout";
import EmployerApplicants from "./pages/EmployerApplicants";
import EmployerShortlisted from "./pages/EmployerShortlisted";
import EmployerInterviews from "./pages/EmployerInterviews";
import JobSeekerProtectedRoute from "./pages/JobSeekerProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/accountType" element={<AccountType />} />
      <Route path="/signup/jobseeker" element={<SignUp />} />
      <Route path="/signup/employer" element={<SignupEmployer />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      <Route
        path="/JobSeekerCompleteProfile"
        element={<JobSeekerCompleteProfile />}
      />

      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route element={<JobSeekerProtectedRoute />}>
        <Route element={<JobSeekerPageLayout />}>
          <Route path="/findjob" element={<FindJobs />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route
            path="/my-applications/:id"
            element={<MyApplicationDetails />}
          />
          <Route path="/profile" element={<JobSeekerProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        </Route>
      </Route>
      {/* =====================================================
          JOB SEEKER DASHBOARD
          
          Dashboard keeps its existing sidebar layout.
          Do NOT put it inside JobSeekerPageLayout.
      ===================================================== */}

      <Route
        path="/JobSeekerDashboardTemplate"
        element={<JobSeekerDashboardTemplate />}
      >
        <Route path="JobSeekerDashboard" element={<JobSeekerDashboard />} />
      </Route>

      {/* =====================================================
          EMPLOYER STANDALONE PAGES
          
          These paths remain unchanged.
      ===================================================== */}

      <Route path="/employer/jobs/:id" element={<JobDetails />} />

      <Route path="/employer-profile" element={<EmployerProfile />} />

      <Route path="/employer-profile/edit" element={<EditEmployerProfile />} />

      <Route path="/my-jobs" element={<MyJobs />} />

      <Route path="/jobs/:id/edit" element={<EditJob />} />

      <Route path="/jobs/:jobId/applicants" element={<JobApplicants />} />

      <Route
        path="/applications/:id/applicant"
        element={<ApplicationDetails />}
      />

      {/* =====================================================
          EMPLOYER DASHBOARD
          
          EmployerLayout already contains its Outlet/sidebar.
      ===================================================== */}

      <Route path="/employer" element={<EmployerLayout />}>
        <Route path="dashboard" element={<EmployerDashboard />} />

        <Route path="jobs" element={<MyJobs />} />

        <Route path="jobs/create" element={<CreateJob />} />

        <Route path="applicants" element={<EmployerApplicants />} />

        <Route path="interviews" element={<EmployerInterviews />} />

        <Route path="shortlisted" element={<EmployerShortlisted />} />

        <Route path="profile" element={<EmployerProfile />} />

        <Route path="profile/edit" element={<EditEmployerProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
