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
      setLoading(true);
      setNoJobs(false);
      setError(null);

      try {
        const params: any = {};

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

        const res = await axios.get("/api/v1/job/get", {
          params,
          withCredentials: true,
        });

        if (res.data.success) {
          console.log(`🔍 API returned ${res.data.data.length} jobs`);

          if (res.data.data.length === 0) {
            setNoJobs(true);

            dispatch(setAllJobs([]));
          } else {
            setNoJobs(false);

            dispatch(setAllJobs(res.data.data));
          }
        } else {
          console.error("🔍 API returned success: false");
          setError(res.data.message || "Failed to fetch jobs");
          setNoJobs(true);

          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.error("🔍 Error fetching jobs:", error);
        setError("An error occurred while fetching jobs");
        setNoJobs(true);

        dispatch(setAllJobs([]));
      } finally {
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
