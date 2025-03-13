import React, { useState, useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";

// Define types for the response and the applicants
interface Applicant {
  _id: string;
  name: string;
  email: string;
  appliedAt: string;
  job: string;
  resume?: string;
  applicant: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    profile?: {
      resume?: string;
      resumeOriginalName?: string;
    };
    createdAt?: string;
  };
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface ApplicantsResponse {
  success: boolean;
  applications: Applicant[];
  message: string;
}

const Applicants: React.FC = () => {
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();
  
  const [localApplicants, setLocalApplicants] = useState<Applicant[]>([]);
  const reduxApplicants = useSelector((state: { application: { applicants: Applicant[] } }) => 
    state?.application?.applicants
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        console.log("Fetching Applicants for Job ID:", params.id);

        const axiosInstance = axios.create({
          baseURL: "/api/v1",
          withCredentials: true,
          timeout: 10000,
        });

        const res = await axiosInstance.get<ApplicantsResponse>(
          `/application/${params.id}/applicants`
        );

        console.log("API Response:", {
          success: res.data.success,
          message: res.data.message,
          applicationsCount: res.data.applications?.length
        });

        if (res.data.success && res.data.applications) {
          const applicantsData = res.data.applications;
          console.log("About to dispatch:", applicantsData);
          
          // Store in local state as our primary data source
          setLocalApplicants(applicantsData);
          
          // Try dispatching to Redux
          try {
            dispatch(setAllApplicants(applicantsData));
          } catch (reduxError) {
            console.error("Redux dispatch error:", reduxError);
          }
        } else {
          setError(res.data.message || "Failed to fetch applicants.");
        }
      } catch (error) {
        console.error("Fetch Applicants Error:", error);
        setError("An error occurred fetching applicants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  // Use either Redux state or local state, with preference to local state
  const displayApplicants = localApplicants;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log("Rendering with state:", {
    reduxApplicants,
    localApplicants,
    displayApplicants
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-4 text-center">
        <div className="mb-4 text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="my-5 text-2xl font-semibold text-gray-800">Applicants ({displayApplicants?.length || 0})</h1>
      {displayApplicants && displayApplicants.length > 0 ? (
        <ApplicantsTable applicantsData={displayApplicants} />
      ) : (
        <div className="py-10 text-center text-gray-500">
          No applicants found for this job posting.
        </div>
      )}
    </div>
  );
};

export default Applicants;
