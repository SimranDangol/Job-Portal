import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllJobs";

// Type for input value
type AdminJobsProps = object;

const AdminJobs: React.FC<AdminJobsProps> = () => {
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAllAdminJobs();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="max-w-6xl px-4 mx-auto my-10 sm:px-6 lg:px-8">
      <Card className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl">
        {/* New Job Button  */}
        <div className="flex justify-end my-4">
          <Button
            className="w-full px-4 py-2 text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 sm:w-auto"
            onClick={() => navigate("/admin/jobs/create")}
          >
            Create New Job
          </Button>
        </div>

        {/* Filter Input */}
        <div className="my-6">
          <Input
            className="w-full max-w-[350px] bg-gray-100 text-gray-800 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Admin Jobs Table */}
        <AdminJobsTable />
      </Card>
    </div>
  );
};

export default AdminJobs;
