import { setAllAdminJobs } from '@/redux/jobSlice'
import axios, { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`/api/v1/job/getadminjobs`, {
                    withCredentials: true
                });
                console.log("Admin jobs response:", res.data);
                if (res.data.success) {
                    // Handle possible different response structures
                    const jobsData = res.data.data || res.data.jobs;
                    if (jobsData) {
                        dispatch(setAllAdminJobs(jobsData));
                    } else {
                        console.error("Jobs data not found in response:", res.data);
                    }
                }
            } catch (error) {
                // Cast the error to AxiosError to access response and message
                const axiosError = error as AxiosError;
                console.error("Error fetching admin jobs:", axiosError.response?.data || axiosError.message);
            }
        }
        fetchAllAdminJobs();
    }, [dispatch]) // Added dispatch to dependency array
}

export default useGetAllAdminJobs;
