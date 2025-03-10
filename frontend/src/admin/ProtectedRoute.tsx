import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const {user} = useSelector((state: { auth: { user: { role: string } | null } }) => state.auth);

    const navigate = useNavigate();

    useEffect(()=>{
        if(user === null || user.role !== 'recruiter'){
            navigate("/");
        }
    },[]);

    return (
        <>
        {children}
        </>
    )
};
export default ProtectedRoute;