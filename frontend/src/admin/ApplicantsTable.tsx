import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Applicant, updateApplicationStatus } from "@/redux/applicationSlice";
import { MoreHorizontal } from "lucide-react";

interface ApplicantsTableProps {
  applicantsData: Applicant[];
}

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ applicantsData }) => {
  const dispatch = useDispatch();

  const statusHandler = async (status: string, id: string) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`/api/v1/application/${id}/update`, { status });

      if (res.data.success) {
        dispatch(updateApplicationStatus({ id, status }));
        toast.success("Status updated successfully");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "An error occurred");
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const fetchApplicantDetails = async (applicantId: string) => {
    try {
      const response = await axios.get(`/api/v1/users/${applicantId}`);
      if (response.data.success) {
        return response.data.user;
      }
    } catch (error) {
      console.error("Error fetching applicant details:", error);
    }
    return null;
  };

  if (!applicantsData || applicantsData.length === 0) {
    return <div className="py-10 text-center text-gray-500">No applicants found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A list of recent applicants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicantsData.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.applicant?.fullName || "N/A"}</TableCell>
              <TableCell>{item.applicant?.email || "N/A"}</TableCell>
              <TableCell>
                {item.applicant?.phoneNumber ? (
                  item.applicant.phoneNumber
                ) : (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={async () => {
                      const data = await fetchApplicantDetails(item.applicant?._id);
                      if (data?.phoneNumber) {
                        toast.success(`Contact: ${data.phoneNumber}`);
                      } else {
                        toast.error("Contact not available");
                      }
                    }}
                  >
                    Load contact
                  </button>
                )}
              </TableCell>
              <TableCell>
                {(item.applicant?.profile?.resume || item.applicant?.resume) ? (
                  <a
                    className="text-blue-600 cursor-pointer"
                    href={item.applicant.profile?.resume || item.applicant.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                ) : (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={async () => {
                      const data = await fetchApplicantDetails(item.applicant?._id);
                      if (data?.resume || data?.profile?.resume) {
                        window.open(data.resume || data.profile?.resume, "_blank");
                      } else {
                        toast.error("Resume not available.");
                      }
                    }}
                  >
                    Load resume
                  </button>
                )}
              </TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-700" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status, index) => (
                      <div
                        key={index}
                        onClick={() => statusHandler(status, item._id)}
                        className="flex items-center w-full p-2 my-2 rounded cursor-pointer hover:bg-gray-100"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
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

export default ApplicantsTable;
