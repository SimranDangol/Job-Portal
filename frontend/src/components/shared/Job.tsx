
import React, { useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSavedJobs } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

interface Company {
  name?: string;
  logo?: string;
}

interface JobData {
  _id: string;
  title: string;
  description: string;
  position?: string;
  secondaryPosition?: string;
  jobType?: string;
  createdAt?: string;
  company?: Company | null;
  location?: string;
}

interface JobProps {
  job: JobData;
  viewMode: string;
}

const Job: React.FC<JobProps> = ({ job, viewMode }) => {
  const dispatch = useDispatch();
  const savedJobs = useSelector((state: any) => state.auth.user?.savedJobs || []);
  const token = localStorage.getItem("token");
  console.log("Saved Jobs from Redux:", savedJobs);
  const isSaved = savedJobs?.includes(job._id); // Check if this job is saved

  const navigate = useNavigate();
  const jobCardStyle =
    viewMode === "list"
      ? "flex-row" // List view style
      : "flex-col"; // Grid view style

  const daysAgoFunction = (mongodbTime: string): number => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleSaveForLater = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (!token) {
      toast.error("Please login to save jobs!");
      return;
    }

    try {
      // Send API request to save/unsave the job on the server
      if (isSaved) {
        // If already saved, unsave it
        await axios.post(
          "/api/v1/user/unsave",
          { jobId: job._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // If not saved, save it
        await axios.post(
          "/api/v1/user/save",
          { jobId: job._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Ensure savedJobs is always an array, fallback to empty array if undefined
      const updatedSavedJobs = isSaved
        ? savedJobs?.filter((id: string) => id !== job._id) // Ensure savedJobs is defined
        : [...(savedJobs || []), job._id]; // Fallback to empty array if undefined

      // Dispatch the action to update saved jobs in Redux state
      dispatch(setSavedJobs(updatedSavedJobs));

      // Toast message
      if (isSaved) {
        toast.success("Job removed from saved jobs!");
      } else {
        toast.success("Job saved for later!");
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      toast.error("Failed to update saved jobs");
    }
  };

  const companyName = job?.company?.name || "Unknown Company";
  const companyInitial = companyName.charAt(0) || "?";

  useEffect(() => {
    // Log the current saved jobs to check if they're updated correctly
    console.log("Current saved jobs:", savedJobs);
  }, [savedJobs]); // Re-run on savedJobs change

  return (
    <div
      className={`p-6 transition-all bg-white border shadow-md cursor-pointer rounded-xl hover:shadow-lg h-full flex flex-col ${jobCardStyle}`}
      onClick={() => navigate(`/description/${job._id}`)}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Company Logo & Job Info */}
        <div className="flex items-center gap-4">
          <Avatar className="border shadow-sm w-14 h-14">
            {job?.company?.logo ? (
              <AvatarImage src={job.company.logo} alt={companyName} />
            ) : (
              <AvatarFallback className="font-semibold bg-primary/10 text-primary">
                {companyInitial}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600">
              {job.location || "Location not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="flex-grow">
        <p className="mt-3 text-sm text-gray-700 line-clamp-2">
          {job.description || "No description provided"}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {job.position ? (
            <Badge className="px-3 py-1 text-xs border text-slate-950 bg-">
              {job.position}
            </Badge>
          ) : (
            <Badge className="px-3 py-1 text-xs text-gray-500">
              No position specified
            </Badge>
          )}
          {job.secondaryPosition && (
            <Badge className="px-3 py-1 text-xs text-orange-700 bg-orange-100 rounded-full hover:bg-orange-200">
              {job.secondaryPosition}
            </Badge>
          )}
          {job.jobType ? (
            <Badge className="px-3 py-1 text-xs text-green-700 bg-green-100 rounded-full hover:bg-green-200">
              {job.jobType}
            </Badge>
          ) : (
            <Badge className="px-3 py-1 text-xs text-gray-500">
              Job type not specified
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-auto">
        <span className="text-xs text-gray-500">
          {job.createdAt
            ? daysAgoFunction(job.createdAt) === 0
              ? "Today"
              : `${daysAgoFunction(job.createdAt)} days ago`
            : "Recently"}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/description/${job._id}`);
            }}
          >
            View Details
          </Button>
          <Button
            variant={isSaved ? "destructive" : "secondary"} // Apply different variants based on the state
            size="sm"
            className="p-2 text-xs"
            onClick={handleSaveForLater}
          >
            {isSaved ? "Unsave" : "Save for Later"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job;