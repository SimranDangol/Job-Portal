import { RootState } from "@/redux/app/store";
import { setAllJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const useGetJobs = () => {
  const dispatch = useDispatch();

  const {
    searchedQuery,
    selectedCategory,
    selectedLocation,
    selectedIndustry,
  } = useSelector((state: RootState) => state.job);

  const [loading, setLoading] = useState(true);
  const [noJobs, setNoJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 useGetJobs - Fetching jobs with filters:", {
      searchedQuery,
      selectedCategory,
      selectedLocation,
      selectedIndustry,
    });

    const fetchAllJobs = async () => {
      // Start loading and reset state
      setLoading(true);
      setNoJobs(false);
      setError(null);

      try {
        // Build request parameters
        const params: any = {};

        // Only add parameters that have values and aren't "All"
        if (searchedQuery && searchedQuery.trim() !== "") {
          params.keyword = searchedQuery.trim();
        }

        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        if (selectedLocation && selectedLocation !== "All") {
          params.location = selectedLocation;
        }

        if (selectedIndustry && selectedIndustry !== "All") {
          params.industry = selectedIndustry;
        }

        console.log("🔍 Final API request params:", params);

        // Make the request
        const res = await axios.get("/api/v1/job/get", {
          params,
          withCredentials: true,
        });

        // Process response
        if (res.data.success) {
          console.log(`🔍 API returned ${res.data.data.length} jobs`);

          if (res.data.data.length === 0) {
            setNoJobs(true); // Set to true if no jobs found
            // Make sure the jobs state is empty
            dispatch(setAllJobs([]));
          } else {
            setNoJobs(false); // Reset if jobs are found
            // Update the jobs state with the new data
            dispatch(setAllJobs(res.data.data));
          }
        } else {
          console.error("🔍 API returned success: false");
          setError(res.data.message || "Failed to fetch jobs");
          setNoJobs(true);
          // Keep jobs state clear when API fails
          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.error("🔍 Error fetching jobs:", error);
        setError("An error occurred while fetching jobs");
        setNoJobs(true);
        // Keep jobs state clear when request fails
        dispatch(setAllJobs([]));
      } finally {
        // Short delay to prevent flickering on fast responses
        setTimeout(() => {
          setLoading(false);
        }, 300);
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

  return { loading, noJobs, error };
};

export default useGetJobs;

