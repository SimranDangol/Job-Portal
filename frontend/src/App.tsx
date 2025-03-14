import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import Layout from "./Layout";
import Login from "./auth/Login";
import SignUp from "./auth/Signup";
import { Toaster } from "./components/ui/sonner";
import Home from "./components/shared/Home";
import Jobs from "./components/shared/Jobs";
import Browse from "./components/shared/Browse";
import Profile from "./components/shared/Profile";
import JobDescription from "./components/shared/JobDescription";
import Companies from "./admin/Companies";
import CompanyCreate from "./admin/CompanyCreate";
import CompanySetup from "./admin/CompanySetup";
import AdminJobs from "./admin/AdminJob";
import PostJobs from "./admin/PostJobs";
import Applicants from "./admin/Applicants";
import PrivateRoute from "./components/shared/PrivateRoute";
import SavedJobs from "./components/shared/SavedJob";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<SignUp />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="browse" element={<Browse />} />
      <Route path="profile" element={<PrivateRoute element={<Profile />} />} />
      <Route
        path="saved-jobs"
        element={<PrivateRoute element={<SavedJobs />} />}
      />
      <Route path="description/:id" element={<JobDescription />} />
      <Route
        path="admin/companies"
        element={<PrivateRoute element={<Companies />} />}
      />
      <Route
        path="admin/companies/create"
        element={<PrivateRoute element={<CompanyCreate />} />}
      />
      <Route
        path="admin/companies/:id"
        element={<PrivateRoute element={<CompanySetup />} />}
      />
      <Route
        path="admin/jobs"
        element={<PrivateRoute element={<AdminJobs />} />}
      />
      <Route
        path="admin/jobs/create"
        element={<PrivateRoute element={<PostJobs />} />}
      />
      <Route
        path="admin/jobs/:id/applicants"
        element={<PrivateRoute element={<Applicants />} />}
      />
    </Route>
  )
);

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <FaSpinner className="w-16 h-16 text-black animate-spin" />
            <p className="mt-4 text-lg text-black">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <RouterProvider router={router} />
          <Toaster />
        </>
      )}
    </>
  );
};

export default App;
