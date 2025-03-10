import { setAllAppliedJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`/api/v1/application/get`, {withCredentials: true});
                console.log("API Response:", res.data);
                
                // Check for API structure based on your ApiResponse class
                if (res.data.statusCode === 200) {
                    // Use the correct property from your API response
                    const applications = res.data.data || [];
                    console.log("Applications:", applications);
                    dispatch(setAllAppliedJobs(applications));
                } else {
                    console.log("API returned error:", res.data.message);
                    // Dispatch empty array to clear any previous applications
                    dispatch(setAllAppliedJobs([]));
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                // Dispatch empty array on error
                dispatch(setAllAppliedJobs([]));
            }
        }
        fetchAppliedJobs();
    }, [dispatch]);
};

export default useGetAppliedJobs;