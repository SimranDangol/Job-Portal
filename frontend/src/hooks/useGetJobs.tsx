import { RootState } from "@/redux/app/store";
import { setAllJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


const useGetJobs = () => {
  const dispatch = useDispatch();
  
  // Type the store with RootState to ensure the correct state structure
  const { searchedQuery, selectedCategory, selectedLocation, selectedIndustry } = useSelector(
    (state: RootState) => state.job
  );

  const [loading, setLoading] = useState(true);
  const [noJobs, setNoJobs] = useState(false);

  useEffect(() => {
    console.log("Fetching jobs with filters:", {
      searchedQuery,
      selectedCategory,
      selectedLocation,
      selectedIndustry,
    });

    const fetchAllJobs = async () => {
      setLoading(true); // Start loading
      try {
        // Build request parameters
        const params: any = {};

        if (searchedQuery) params.keyword = searchedQuery;
        if (selectedCategory && selectedCategory !== "All")
          params.category = selectedCategory;
        if (selectedLocation && selectedLocation !== "All")
          params.location = selectedLocation;
        if (selectedIndustry && selectedIndustry !== "All")
          params.industry = selectedIndustry;

        console.log("Requesting jobs with filters:", params);

        // Make the request
        const res = await axios.get("/api/v1/job/get", {
          params,
          withCredentials: true,
        });

        // Process response
        if (res.data.success) {
          if (res.data.data.length === 0) {
            setNoJobs(true); // Set to true if no jobs found
          } else {
            setNoJobs(false); // Reset if jobs are found
            dispatch(setAllJobs(res.data.data)); // Dispatch jobs
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    fetchAllJobs();
  }, [
    searchedQuery,
    selectedCategory,
    selectedLocation,
    selectedIndustry,
    dispatch,
  ]);

  return { loading, noJobs };
};

export default useGetJobs;
