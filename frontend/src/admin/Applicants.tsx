import React, { useState, useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";

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
    createdAt?: string;
  };
  status: "pending" | "approved" | "disapproved";
  createdAt: string;
  updatedAt?: string;
}

interface ApplicantsResponse {
  success: boolean;
  data?: Applicant[];
  applications?: Applicant[];
  message: string;
}

const Applicants: React.FC = () => {
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const [localApplicants, setLocalApplicants] = useState<Applicant[]>([]);
  const reduxApplicants = useSelector(
    (state: { application: { applicants: Applicant[] } }) =>
      state?.application?.applicants || []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllApplicants = async () => {
    if (!params.id) {
      setError("Job ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching Applicants for Job ID:", params.id);

      const axiosInstance = axios.create({
        baseURL: "/api/v1",
        withCredentials: true,
        timeout: 10000,
      });

      const res = await axiosInstance.get<ApplicantsResponse>(
        `/application/${params.id}/applicants`
      );

      // Debug logging
      console.log("FULL API RESPONSE:", res.data);
      console.log("Available keys:", Object.keys(res.data || {}));
      console.log("Response structure:", {
        success: res.data.success,
        message: res.data.message,
        hasData: !!res.data.data,
        hasApplications: !!res.data.applications,
        dataLength: res.data.data?.length || res.data.applications?.length || 0,
      });

      if (res.data.success) {
        // Handle both possible response structures
        const applicantsData = res.data.data || res.data.applications || [];

        console.log("Extracted applicants data:", applicantsData);
        console.log("Number of applicants:", applicantsData.length);

        // Validate data structure
        if (Array.isArray(applicantsData)) {
          // Store in local state as primary data source
          setLocalApplicants(applicantsData);

          // Update Redux store
          try {
            dispatch(setAllApplicants(applicantsData));
            console.log("Successfully dispatched to Redux");
          } catch (reduxError) {
            console.error("Redux dispatch error:", reduxError);
            // Continue execution even if Redux fails
          }
        } else {
          console.error(
            "Invalid data structure - not an array:",
            applicantsData
          );
          setError("Invalid data format received from server");
        }
      } else {
        setError(res.data.message || "Failed to fetch applicants");
      }
    } catch (error) {
      console.error("Fetch Applicants Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
          setError(errorMessage);
          console.error("Server error response:", error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          setError("No response from server. Please check your connection.");
          console.error("No response received:", error.request);
        } else {
          // Something else happened
          setError("Request failed: " + error.message);
          console.error("Request setup error:", error.message);
        }
      } else {
        setError("An unexpected error occurred");
        console.error("Non-Axios error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, [params.id, dispatch]);

  const displayApplicants = localApplicants;

  const handleStatusUpdate = () => {
    fetchAllApplicants();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-4 text-center">
        <div className="mb-4 text-red-500">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Applicants
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllApplicants}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Job Applicants
        </h1>
        <p className="text-gray-600">
          {displayApplicants?.length || 0} applicant
          {(displayApplicants?.length || 0) !== 1 ? "s" : ""} found
        </p>
      </div>

      {displayApplicants && displayApplicants.length > 0 ? (
        <ApplicantsTable
          applicantsData={displayApplicants}
          onStatusUpdate={handleStatusUpdate}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No applicants yet
          </h3>
          <p className="text-gray-600">
            Applications will appear here once candidates apply for this job
            posting.
          </p>
        </div>
      )}
    </div>
  );
};

export default Applicants;
