import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
        <Route path="register" element={<SignUp />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="browse" element={<Browse />} />
        <Route path="profile" element={<Profile />} />
        <Route path="description/:id" element={<JobDescription />} />
        <Route path="admin/companies" element={<Companies />} />
        <Route path="admin/companies/create" element={<CompanyCreate />} />
        <Route path="admin/companies/:id" element={<CompanySetup />} />
        <Route path="admin/jobs" element={<AdminJobs />} />
        <Route path="admin/jobs/create" element={<PostJobs />} />
        <Route path="admin/jobs/:id/applicants" element={<Applicants />} />
      </Route>
    </>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
