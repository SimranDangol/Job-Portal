import React, { useEffect, useState } from "react";
import { Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Defining types for job and state
interface Job {
  _id: string;
  title: string;
  company: { name: string };
  createdAt: string;
}

interface JobState {
  allAdminJobs: Job[];
  searchJobByText: string;
}

const AdminJobsTable: React.FC = () => {
  const { allAdminJobs, searchJobByText } = useSelector(
    (state: { job: JobState }) => state.job
  );
  const [filterJobs, setFilterJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("All admin jobs from Redux:", allAdminJobs);
    // Safely handle potential undefined or null allAdminJobs
    const jobs = Array.isArray(allAdminJobs) ? allAdminJobs : [];

    const filteredJobs = jobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  if (!filterJobs || filterJobs.length === 0) {
    return (
      <div className="p-4 text-center">
        No jobs found. Try posting a new job.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="border border-gray-200 rounded-lg shadow-md">
        <TableCaption>A list of your recently posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-600">Company Name</TableHead>
            <TableHead className="text-gray-600">Role</TableHead>
            <TableHead className="text-gray-600">Date</TableHead>
            <TableHead className="text-right text-gray-600">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job?.company?.name || "N/A"}</TableCell>
              <TableCell>{job?.title || "N/A"}</TableCell>
              <TableCell>
                {job?.createdAt ? job.createdAt.split("T")[0] : "N/A"}
              </TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="text-gray-600 hover:text-blue-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 rounded-lg shadow-md">
                    {/* Applicants Button */}
                    <div
                      onClick={() =>
                        navigate(`/recruiter/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 p-2 mt-1 rounded-md cursor-pointer w-fit hover:bg-gray-100 min-h-[25px] py-1"
                    >
                      <Eye className="w-4 text-gray-600 hover:text-blue-600" />
                      <span className="text-sm text-gray-700">Applicants</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
