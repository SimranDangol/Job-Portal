import React from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Briefcase } from "lucide-react";

interface Company {
  name: string;
  _id: string;
}

interface Job {
  title: string;
  company: Company;
  _id: string;
}

interface AppliedJob {
  _id: string;
  job: Job;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface RootState {
  job: {
    allAppliedJobs: AppliedJob[];
  };
}

const AppliedJobTable: React.FC = () => {
  const allAppliedJobs = useSelector((store: RootState) => store.job.allAppliedJobs) || [];

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    } catch (error) {
      return dateString.split("T")[0];
    }
  };

  const getStatusStyles = (status: string): { bg: string; text: string } => {
    switch (status) {
      case "rejected":
        return { bg: "bg-red-200", text: "text-red-700" };
      case "accepted":
        return { bg: "bg-green-200", text: "text-green-700" };
      case "pending":
      default:
        return { bg: "bg-yellow-200", text: "text-yellow-700" };
    }
  };

  return (
    <Card className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-lg">
      <CardHeader className="px-6 py-4 bg-gray-100 border-b">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Briefcase className="w-5 h-5 text-gray-700" />
          Applied Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <Table className="min-w-full border-collapse">
            <TableCaption className="mt-2 text-sm text-gray-600">
              {allAppliedJobs.length > 0 ? "Your job applications" : "No jobs applied yet"}
            </TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-gray-700">Date</TableHead>
                <TableHead className="px-4 py-3 text-left text-gray-700">Job Title</TableHead>
                <TableHead className="px-4 py-3 text-left text-gray-700">Company</TableHead>
                <TableHead className="px-4 py-3 text-right text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAppliedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                    You haven't applied to any jobs yet.
                  </TableCell>
                </TableRow>
              ) : (
                allAppliedJobs.map((appliedJob) => {
                  const statusStyles = getStatusStyles(appliedJob?.status);
                  return (
                    <TableRow key={appliedJob._id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-3">{formatDate(appliedJob?.createdAt)}</TableCell>
                      <TableCell className="px-4 py-3 font-medium">{appliedJob.job?.title || "N/A"}</TableCell>
                      <TableCell className="px-4 py-3">{appliedJob.job?.company?.name || "N/A"}</TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <Badge variant="outline" className={`${statusStyles.bg} ${statusStyles.text} px-3 py-1 rounded-full text-sm font-medium border-0`}>
                          {appliedJob?.status || "Unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppliedJobTable;
