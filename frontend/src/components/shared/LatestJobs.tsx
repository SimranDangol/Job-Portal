import { useSelector } from "react-redux";
import JobCards from "./JobCards";
import { RootState } from "@/redux/app/store";
import useGetJobs from "@/hooks/useGetJobs";
import { useDispatch } from "react-redux"; 
import { useEffect } from "react";
import { setSelectedCategory } from "@/redux/jobSlice";

interface Job {
  _id: string;
  title: string;
  description: string;
  position: string;
  jobType: string;
  company: {
    name: string;
    logo?: string;
  };
  location?: string;
}


const LatestJobs = () => {
  const dispatch = useDispatch();
  
  // Reset any category filter when entering the Latest Jobs section
  useEffect(() => {
    dispatch(setSelectedCategory("All"));
  }, [dispatch]);
  
  // Fetch all jobs without category filter
  useGetJobs();

  const { allJobs } = useSelector((state: RootState) => state.job);
  
  console.log("Latest Jobs - Total jobs available:", allJobs.length);

  return (
    <div className="px-4 mx-auto my-20 mt-6 max-w-7xl sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center sm:text-4xl">
        <span className="text-[#6A38C2]">Latest </span> Job Openings
      </h1>
      {allJobs.length <= 0 ? (
        <div className="flex items-center justify-center mt-10">
          <span className="text-lg text-gray-500">Loading jobs...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 my-10 sm:grid-cols-2 lg:grid-cols-3">
          {allJobs.slice(0, 6).map((job: Job) => (
            <JobCards key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestJobs;