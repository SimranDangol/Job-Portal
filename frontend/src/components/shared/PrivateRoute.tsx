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

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "Job Seeker") {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
