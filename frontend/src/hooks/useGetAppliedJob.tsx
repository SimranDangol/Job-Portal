import { setAllAppliedJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`/api/v1/application/get`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data);

        if (res.data.statusCode === 200) {
          const applications = res.data.data || [];
          console.log("Applications:", applications);
          dispatch(setAllAppliedJobs(applications));
        } else {
          console.log("API returned error:", res.data.message);

          dispatch(setAllAppliedJobs([]));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);

        dispatch(setAllAppliedJobs([]));
      }
    };
    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;
