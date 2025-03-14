import { setAllAdminJobs } from "@/redux/jobSlice";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`/api/v1/job/getadminjobs`, {
          withCredentials: true,
        });
        console.log("Admin jobs response:", res.data);
        if (res.data.success) {
          const jobsData = res.data.data || res.data.jobs;
          if (jobsData) {
            dispatch(setAllAdminJobs(jobsData));
          } else {
            console.error("Jobs data not found in response:", res.data);
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Error fetching admin jobs:",
          axiosError.response?.data || axiosError.message
        );
      }
    };
    fetchAllAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
