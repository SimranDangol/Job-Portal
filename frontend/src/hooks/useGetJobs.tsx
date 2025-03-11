import { RootState } from "@/redux/app/store";
import { setAllJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const useGetJobs = () => {
  const dispatch = useDispatch();

  // Type the store with RootState to ensure the correct state structure
  const {
    searchedQuery,
    selectedCategory,
    selectedLocation,
    selectedIndustry,
  } = useSelector((state: RootState) => state.job);

  const [loading, setLoading] = useState(true);
  const [noJobs, setNoJobs] = useState(false);

  useEffect(() => {
    console.log("🔍 useGetJobs - Fetching jobs with filters:", {
      searchedQuery,
      selectedCategory,
      selectedLocation,
      selectedIndustry,
    });

    const fetchAllJobs = async () => {
      setLoading(true); // Start loading
      setNoJobs(false); // Reset no jobs state

      try {
        // Build request parameters
        const params: any = {};

        // Only add parameters that have values and aren't "All"
        if (searchedQuery && searchedQuery.trim() !== "") {
          params.keyword = searchedQuery.trim();
          console.log("🔍 Searching for keyword:", params.keyword);
        }

        if (selectedCategory && selectedCategory !== "All") {
          params.category = selectedCategory;
          console.log("🔍 Filtering by category:", selectedCategory);
        }

        if (selectedLocation && selectedLocation !== "All") {
          params.location = selectedLocation;
          console.log("🔍 Filtering by location:", selectedLocation);
        }

        if (selectedIndustry && selectedIndustry !== "All") {
          params.industry = selectedIndustry;
          console.log("🔍 Filtering by industry:", selectedIndustry);
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
            console.log("🔍 No jobs found for the current filters");
          } else {
            setNoJobs(false); // Reset if jobs are found
            dispatch(setAllJobs(res.data.data)); // Dispatch jobs
          }
        } else {
          console.error("🔍 API returned success: false");
          setNoJobs(true);
        }
      } catch (error) {
        console.error("🔍 Error fetching jobs:", error);
        setNoJobs(true);
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
