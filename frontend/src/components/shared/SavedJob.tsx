import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import { setSavedJobs } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

interface Company {
  _id: string;
  name: string;
  logo?: string;
}

interface Job {
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

const SavedJobs: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [savedJobsList, setSavedJobsList] = useState<Job[]>([]);

  const savedJobIds = useSelector(
    (state: any) => state.auth.user?.savedJobs || []
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    if (!savedJobIds.length) {
      setLoading(false);
      setSavedJobsList([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/v1/user/saved-jobs", {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobIds: savedJobIds },
      });

      if (response.data.statusCode === 200) {
        setSavedJobsList(response.data.data.jobs);
      } else {
        toast.error("Unexpected response format from server");
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      const response = await axios.post(
        "/api/v1/user/unsave",
        { jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.statusCode === 200) {
        dispatch(
          setSavedJobs(savedJobIds.filter((id: string) => id !== jobId))
        );
        setSavedJobsList((prevJobs) =>
          prevJobs.filter((job) => job._id !== jobId)
        );
        toast.success("Job removed from saved jobs!");
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
      toast.error("Failed to remove job from saved jobs");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Loading State */}
      {loading && (
        <div className="space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="animate-pulse">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-[200px] h-4" />
                    <Skeleton className="w-[150px] h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-8 mt-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-[80px] h-8 rounded-md" />
                  <Skeleton className="w-[80px] h-8 rounded-md bg-destructive" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && savedJobsList.length === 0 && (
        <div className="flex justify-center items-center w-full">
          <Card className="w-full max-w-md mx-auto mt-8">
            <CardContent className="pt-6 text-center space-y-4">
              <h2 className="text-xl font-semibold">
                You haven't saved any jobs yet
              </h2>

              <Button onClick={() => navigate("/jobs")} className="w-full">
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Saved Jobs List */}
      {!loading && savedJobsList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobsList.map((job) => (
            <Card
              key={job._id}
              className="group hover:-translate-y-1 transition-transform duration-300 cursor-pointer w-full"
              onClick={() => navigate(`/description/${job._id}`)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="ring-2 ring-primary">
                  {job.company?.logo ? (
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {job.company?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.location || "Location not specified"}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-muted-foreground">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.position && (
                    <Badge variant="secondary">{job.position}</Badge>
                  )}
                  {job.jobType && (
                    <Badge variant="outline">{job.jobType}</Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/description/${job._id}`);
                  }}
                >
                  View Details
                </Button>

                <Button
                  variant="destructive"
                  onClick={(e) => handleUnsaveJob(job._id, e)}
                  className="group hover:bg-destructive/90 transition-colors"
                >
                  Unsave
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
