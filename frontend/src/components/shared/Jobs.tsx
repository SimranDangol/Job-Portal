import { useSelector } from "react-redux";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { RootState } from "@/redux/app/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useGetJobs from "@/hooks/useGetJobs";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "@/redux/jobSlice";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
}

const Jobs = () => {
  const dispatch = useDispatch();
  
  // Reset any category filter when entering the Jobs page
  useEffect(() => {
    dispatch(setSelectedCategory("All"));
  }, [dispatch]);
  
  // Now get all jobs without any category filter
  useGetJobs();
  
  const { allJobs, searchedQuery } = useSelector(
    (state: RootState) => state.job
  );
  const [filterJobs, setFilterJobs] = useState<Job[]>([]);

  useEffect(() => {
    console.log("Jobs page - Total jobs available:", allJobs.length);
    
    // Only filter by search query, not by category
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      // Show all jobs when no search query
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="min-h-screen">
      <div className="px-4 mx-auto mt-5 max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Sidebar filter */}
          <div className="w-full lg:w-[20%]">
            <FilterCard />
          </div>
          
          {/* Job Listings */}
          {filterJobs.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <span className="text-lg text-gray-500">
                {allJobs.length === 0 ? "Loading jobs..." : "No jobs found matching your filters"}
              </span>
            </div>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filterJobs.map((job) => (
                  <div key={job._id} className="flex w-full h-full">
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col justify-between flex-1 w-full h-full"
                    >
                      <Job job={job} viewMode="default" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;