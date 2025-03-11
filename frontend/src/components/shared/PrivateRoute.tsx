// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/app/store";

// const PrivateRoute = ({ element }: { element: JSX.Element }) => {
//   const { user } = useSelector((state: RootState) => state.auth);

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return element;
// };

// export default PrivateRoute;


import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in but is a job seeker, redirect to a different page
  if (user.role === "Job Seeker") {
    return <Navigate to="/" replace />; // Redirect job seekers to their dashboard or another appropriate page
  }

  // If user is a recruiter or admin, allow access to the requested route
  return element;
};

export default PrivateRoute;
