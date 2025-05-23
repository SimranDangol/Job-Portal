import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { BadgeCheck, XCircle, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateApplicationStatus } from "@/redux/applicationSlice";

interface Applicant {
  _id: string;
  job: string;
  applicant: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    resume?: string;
    profile?: {
      resume?: string;
      resumeOriginalName?: string;
    };
  };
  status: "pending" | "approved" | "disapproved";
  createdAt: string;
  updatedAt?: string;
}

interface ApplicantsTableProps {
  applicantsData: Applicant[];
  onStatusUpdate?: () => void; // Callback to refetch data
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicantsData,
  onStatusUpdate,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: "approved" | "disapproved"
  ) => {
    const application = applicantsData.find((a) => a._id === applicationId);
    if (!application) {
      toast.error("Application not found");
      return;
    }

    if (application.status === "approved") {
      toast.error(
        "This application has already been approved and cannot be edited."
      );
      return;
    }

    if (application.status === "disapproved") {
      toast.error(
        "This application has already been disapproved and cannot be edited."
      );
      return;
    }

    try {
      setLoading(true);
      setLoadingId(applicationId);

      const response = await axios.post(
        `/api/v1/application/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update Redux store
        dispatch(
          updateApplicationStatus({
            id: applicationId,
            status: newStatus,
          })
        );

        const statusText =
          newStatus === "approved" ? "approved" : "disapproved";
        toast.success(
          `Application has been ${statusText} successfully. Status is now final and cannot be changed.`
        );

        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update status";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
      setLoadingId(null);
    }
  };

  // Function to handle clicks on disabled buttons
  const handleDisabledButtonClick = (
    applicationStatus: string,
    actionType: "approve" | "reject"
  ) => {
    if (applicationStatus === "approved") {
      toast.warning(
        "This application has already been approved and cannot be modified."
      );
    } else if (applicationStatus === "disapproved") {
      toast.warning(
        "This application has already been disapproved and cannot be modified."
      );
    } else {
      // This shouldn't happen, but just in case
      toast.info("Status cannot be changed at this time.");
    }
  };

  const fetchApplicantDetails = async (applicantId: string) => {
    try {
      const response = await axios.get(`/api/v1/users/${applicantId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        return response.data.data || response.data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching applicant details:", error);
      return null;
    }
  };

  const handleViewContact = async (applicant: Applicant["applicant"]) => {
    if (applicant.phoneNumber) {
      toast.success(`Contact: ${applicant.phoneNumber}`);
      return;
    }

    try {
      const data = await fetchApplicantDetails(applicant._id);
      if (data?.phoneNumber) {
        toast.success(`Contact: ${data.phoneNumber}`);
      } else {
        toast.error("Contact information not available");
      }
    } catch (error) {
      toast.error("Failed to load contact information");
    }
  };

  const handleViewResume = async (applicant: Applicant["applicant"]) => {
    const resumeUrl = applicant.profile?.resume || applicant.resume;

    if (resumeUrl) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const data = await fetchApplicantDetails(applicant._id);
      const fetchedResumeUrl = data?.resume || data?.profile?.resume;

      if (fetchedResumeUrl) {
        window.open(fetchedResumeUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Resume not available");
      }
    } catch (error) {
      toast.error("Failed to load resume");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "disapproved":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  if (!applicantsData || applicantsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No applicants found</p>
        <p className="text-gray-400 text-sm">
          Applications will appear here once candidates apply for this job.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="border border-gray-200 rounded-lg shadow-sm">
        <TableCaption className="text-gray-600">
          Total applicants: {applicantsData.length}
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Full Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Resume</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Applied Date</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicantsData.map((application) => {
            const isStatusFinal = ["approved", "disapproved"].includes(
              application.status
            );
            const isButtonDisabled =
              isStatusFinal || loading || loadingId === application._id;

            return (
              <TableRow key={application._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {application.applicant?.fullName || "N/A"}
                </TableCell>

                <TableCell className="text-gray-600">
                  {application.applicant?.email || "N/A"}
                </TableCell>

                <TableCell>
                  {application.applicant?.phoneNumber ? (
                    <span className="text-sm text-gray-700">
                      {application.applicant.phoneNumber}
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 h-auto p-1"
                      onClick={() => handleViewContact(application.applicant)}
                    >
                      <Eye size={14} className="mr-1" />
                      View Contact
                    </Button>
                  )}
                </TableCell>

                <TableCell>
                  {application.applicant?.profile?.resume ||
                  application.applicant?.resume ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 h-auto p-1"
                      onClick={() => handleViewResume(application.applicant)}
                    >
                      <Download size={14} className="mr-1" />
                      View Resume
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 h-auto p-1"
                      onClick={() => handleViewResume(application.applicant)}
                    >
                      <Eye size={14} className="mr-1" />
                      Load Resume
                    </Button>
                  )}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>
                  {isStatusFinal && (
                    <p className="text-xs text-gray-500 mt-1">
                      Status is final
                    </p>
                  )}
                </TableCell>

                <TableCell className="text-gray-600">
                  {new Date(application.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isButtonDisabled}
                      onClick={() => {
                        if (isStatusFinal) {
                          handleDisabledButtonClick(
                            application.status,
                            "approve"
                          );
                        } else {
                          handleStatusChange(application._id, "approved");
                        }
                      }}
                      className="text-green-600 border-green-300 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingId === application._id && loading ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <BadgeCheck size={14} className="mr-1" />
                      )}
                      Approve
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isButtonDisabled}
                      onClick={() => {
                        if (isStatusFinal) {
                          handleDisabledButtonClick(
                            application.status,
                            "reject"
                          );
                        } else {
                          handleStatusChange(application._id, "disapproved");
                        }
                      }}
                      className="text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingId === application._id && loading ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <XCircle size={14} className="mr-1" />
                      )}
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
