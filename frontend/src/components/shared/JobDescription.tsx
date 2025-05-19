// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { setSingleJob } from "@/redux/jobSlice";
// import axios from "axios";
// import { RootState } from "@/redux/app/store";
// import { toast } from "sonner";
// import {
//   Calendar,
//   MapPin,
//   Briefcase,
//   Award,
//   Users,
//   Building,
// } from "lucide-react";

// const JobDescription: React.FC = () => {
//   const { id: jobId } = useParams<{ id: string }>();
//   const dispatch = useDispatch();
//   const { singleJob } = useSelector((state: RootState) => state.job);
//   const { user } = useSelector((state: RootState) => state.auth);

//   const [isApplied, setIsApplied] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (singleJob?.applications && user?._id) {
//       setIsApplied(
//         singleJob.applications.some(
//           (application) => application.applicant === user._id
//         )
//       );
//     }
//   }, [singleJob, user]);

//   // const applyJobHandler = async (): Promise<void> => {
//   //   if (!user) {
//   //     toast.error("Please login to apply for the job");
//   //     return;
//   //   }

//   //   try {
//   //     const res = await axios.post(`/api/v1/application/apply/${jobId}`, {
//   //       withCredentials: true,
//   //     });

//   //     if (res.data.success) {
//   //       setIsApplied(true);

//   //       if (singleJob) {
//   //         const updatedSingleJob = {
//   //           ...singleJob,
//   //           applications: [
//   //             ...(singleJob.applications || []),
//   //             { applicant: user?._id || "" },
//   //           ],
//   //           company: singleJob.company || {
//   //             _id: "",
//   //             name: "Unknown Company",
//   //           },
//   //           category: singleJob.category || "",
//   //           viewMode: singleJob.viewMode || "grid",
//   //         };
//   //         dispatch(setSingleJob(updatedSingleJob));
//   //       }

//   //       toast.success("You have successfully applied for this job");
//   //     } else {
//   //       toast.error(res.data.message || "Failed to apply for the job");
//   //     }
//   //   } catch (error: any) {
//   //     console.error("Application error:", error);
//   //     let errorMessage = "Something went wrong!";

//   //     if (error?.response?.data?.message) {
//   //       errorMessage = error.response.data.message;
//   //     } else if (error.message) {
//   //       errorMessage = error.message;
//   //     }

//   //     toast.error(errorMessage);
//   //   }
//   // };

//   const applyJobHandler = async (): Promise<void> => {
//     if (!user) {
//       toast.error("Please login to apply for the job");
//       return;
//     }

//     // Check if user's profile is incomplete
//     const missingFields = [];
//     if (!user.resume) missingFields.push("resume");
//     if (!user.profilePicture) missingFields.push("profile picture");

//     if (missingFields.length > 0) {
//       toast.error(
//         `Please complete your profile by adding ${missingFields.join(
//           " and "
//         )} to apply for jobs`
//       );
//       return;
//     }

//     try {
//       const res = await axios.post(`/api/v1/application/apply/${jobId}`, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         setIsApplied(true);

//         if (singleJob) {
//           const updatedSingleJob = {
//             ...singleJob,
//             applications: [
//               ...(singleJob.applications || []),
//               { applicant: user?._id || "" },
//             ],
//             company: singleJob.company || {
//               _id: "",
//               name: "Unknown Company",
//             },
//             category: singleJob.category || "",
//             viewMode: singleJob.viewMode || "grid",
//           };
//           dispatch(setSingleJob(updatedSingleJob));
//         }

//         toast.success("You have successfully applied for this job");
//       } else {
//         toast.error(res.data.message || "Failed to apply for the job");
//       }
//     } catch (error: any) {
//       console.error("Application error:", error);
//       let errorMessage = "Something went wrong!";

//       if (error?.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       toast.error(errorMessage);
//     }
//   };

//   useEffect(() => {
//     const fetchSingleJob = async (): Promise<void> => {
//       setIsLoading(true);

//       if (!user) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const res = await axios.get(`/api/v1/job/get/${jobId}`, {
//           withCredentials: true,
//         });

//         if (res.data.success) {
//           dispatch(setSingleJob(res.data.job));
//         } else {
//           toast.error(res.data.message || "Failed to fetch job details");
//         }
//       } catch (error: any) {
//         const errorMessage =
//           error?.response?.data?.message || "Failed to load job details";
//         toast.error(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (jobId) {
//       fetchSingleJob();
//     }
//   }, [jobId, dispatch, user]);

//   const formatDate = (dateString: string): string => {
//     if (!dateString) return "N/A";

//     try {
//       const date = new Date(dateString);
//       return new Intl.DateTimeFormat("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       }).format(date);
//     } catch (error) {
//       return dateString.split("T")[0] || "N/A";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-4xl px-4 mx-auto my-10 sm:px-6">
//         <div className="animate-pulse">
//           <div className="w-3/4 h-8 mb-4 bg-gray-200 rounded-md"></div>
//           <div className="flex gap-2 mb-6">
//             <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
//             <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
//           </div>
//           <div className="w-full h-4 mb-3 bg-gray-200 rounded-md"></div>
//           <div className="w-full h-4 mb-3 bg-gray-200 rounded-md"></div>
//           <div className="w-full h-4 mb-3 bg-gray-200 rounded-md"></div>
//           <div className="w-3/4 h-4 bg-gray-200 rounded-md"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!singleJob) {
//     return (
//       <div className="max-w-4xl px-4 mx-auto my-10 sm:px-6">
//         <div className="p-8 text-center bg-white rounded-lg shadow-sm">
//           <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />

//           <p className="text-gray-500">
//             No job details available. Please login to see job details.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl px-4 mx-auto my-10 sm:px-6">
//       <div className="overflow-hidden bg-white rounded-lg shadow-lg">
//         {/* Header Section */}
//         <div className="p-6 bg-white border-b md:p-8">
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   {singleJob?.title || "Job Title"}
//                 </h1>

//                 {singleJob?.company?.name && (
//                   <div className="flex items-center gap-2 mt-2 text-gray-600">
//                     <Building className="w-4 h-4" />
//                     <span>{singleJob.company.name}</span>
//                   </div>
//                 )}
//               </div>

//               <Button
//                 onClick={isApplied ? undefined : applyJobHandler}
//                 disabled={isApplied}
//                 className={`px-6 py-2 rounded-md text-white ${
//                   isApplied
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {isApplied ? "Already Applied" : "Apply Now"}
//               </Button>
//             </div>

//             <div className="flex flex-wrap gap-2 mt-4">
//               {singleJob?.position && (
//                 <Badge
//                   variant="outline"
//                   className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
//                 >
//                   {singleJob.position}
//                 </Badge>
//               )}
//               {singleJob?.jobType && (
//                 <Badge
//                   variant="outline"
//                   className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
//                 >
//                   {singleJob.jobType}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Job Details Section */}
//         <div className="p-6 space-y-6 md:p-8">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div className="flex items-start gap-3">
//               <MapPin className="text-gray-500 h-5 w-5 mt-0.5" />
//               <div>
//                 <h3 className="font-semibold text-gray-900">Location</h3>
//                 <p className="text-gray-600">
//                   {singleJob?.location || "Not specified"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <Award className="text-gray-500 h-5 w-5 mt-0.5" />
//               <div>
//                 <h3 className="font-semibold text-gray-900">Experience</h3>
//                 <p className="text-gray-600">
//                   {typeof singleJob?.experienceLevel === "number"
//                     ? `${singleJob.experienceLevel} years`
//                     : singleJob?.experienceLevel || "Not specified"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <Calendar className="text-gray-500 h-5 w-5 mt-0.5" />
//               <div>
//                 <h3 className="font-semibold text-gray-900">Posted Date</h3>
//                 <p className="text-gray-600">
//                   {singleJob?.createdAt
//                     ? formatDate(singleJob.createdAt)
//                     : "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <Users className="text-gray-500 h-5 w-5 mt-0.5" />
//               <div>
//                 <h3 className="font-semibold text-gray-900">Applicants</h3>
//                 <p className="text-gray-600">
//                   {singleJob?.applications?.length || 0} applicants
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Job Requirements Section */}
//           {singleJob?.requirements && singleJob.requirements.length > 0 && (
//             <div className="mt-4">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
//                 Requirements
//               </h2>
//               <ul className="pl-5 text-gray-600 list-disc sm:text-base md:text-lg">
//                 {singleJob.requirements
//                   .slice(0, 6)
//                   .map((req: string, index: number) => (
//                     <li key={index} className="whitespace-normal">
//                       {req}
//                     </li>
//                   ))}
//               </ul>
//             </div>
//           )}

//           {/* Job Description Section */}
//           <div>
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
//               Job Description
//             </h2>
//             <p className="text-gray-600 mt-3">{singleJob?.description}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobDescription;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import { RootState } from "@/redux/app/store";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Users,
  Building,
} from "lucide-react";

const JobDescription: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((state: RootState) => state.job);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (singleJob?.applications && user?._id) {
      setIsApplied(
        singleJob.applications.some(
          (application) => application.applicant === user._id
        )
      );
    }
  }, [singleJob, user]);

  const applyJobHandler = async (): Promise<void> => {
    if (!user) {
      toast.error("Please login to apply for the job");
      return;
    }

    // Check if user's profile is incomplete
    const missingFields = [];
    if (!user.resume) missingFields.push("resume");

    if (missingFields.length > 0) {
      toast.error(
        `Please complete your profile by adding ${missingFields.join(
          " and "
        )} to apply for jobs`
      );
      return;
    }

    try {
      const res = await axios.post(
        `/api/v1/application/apply/${jobId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsApplied(true);

        if (singleJob) {
          const updatedSingleJob = {
            ...singleJob,
            applications: [
              ...(singleJob.applications || []),
              { applicant: user?._id || "" },
            ],
            company: singleJob.company || {
              _id: "",
              name: "Unknown Company",
            },
            category: singleJob.category || "",
            viewMode: singleJob.viewMode || "grid",
          };
          dispatch(setSingleJob(updatedSingleJob));
        }

        toast.success("You have successfully applied for this job");
      } else {
        toast.error(res.data.message || "Failed to apply for the job");
      }
    } catch (error: any) {
      console.error("Application error:", error);
      let errorMessage = "Something went wrong!";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const unapplyJobHandler = async (): Promise<void> => {
    if (!user) {
      toast.error("Please login to manage your applications");
      return;
    }

    try {
      const res = await axios.delete(`/api/v1/application/unapply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(false);

        if (singleJob) {
          const updatedSingleJob = {
            ...singleJob,
            applications:
              singleJob.applications?.filter(
                (app) => app.applicant !== user._id
              ) || [],
            company: singleJob.company || {
              _id: "",
              name: "Unknown Company",
            },
            category: singleJob.category || "",
            viewMode: singleJob.viewMode || "grid",
          };
          dispatch(setSingleJob(updatedSingleJob));
        }

        toast.success("Application withdrawn successfully");
      } else {
        toast.error(res.data.message || "Failed to withdraw application");
      }
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      let errorMessage = "Something went wrong!";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async (): Promise<void> => {
      setIsLoading(true);

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/v1/job/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        } else {
          toast.error(res.data.message || "Failed to fetch job details");
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Failed to load job details";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchSingleJob();
    }
  }, [jobId, dispatch, user]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return dateString.split("T")[0] || "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl px-4 mx-auto my-10 sm:px-6">
        <div className="animate-pulse">
          <div className="w-3/4 h-8 mb-4 bg-gray-200 rounded-md"></div>
          <div className="flex gap-2 mb-6">
            <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
            <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
          </div>
          <div className="w-full h-4 mb-3 bg-gray-200 rounded-md"></div>
          <div className="w-full h-4 mb-3 bg-gray-200 rounded-md"></div>
          <div className="w-full h-4 mb-3 bg-gray-200 rounded-md"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="max-w-4xl px-4 mx-auto my-10 sm:px-6">
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />

          <p className="text-gray-500">
            No job details available. Please login to see job details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-4 mx-auto my-10 sm:px-6">
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="p-6 bg-white border-b md:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {singleJob?.title || "Job Title"}
                </h1>

                {singleJob?.company?.name && (
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{singleJob.company.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {isApplied ? (
                  <Button
                    onClick={unapplyJobHandler}
                    className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Unapply
                  </Button>
                ) : (
                  <Button
                    onClick={applyJobHandler}
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {singleJob?.position && (
                <Badge
                  variant="outline"
                  className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
                >
                  {singleJob.position}
                </Badge>
              )}
              {singleJob?.jobType && (
                <Badge
                  variant="outline"
                  className="text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                >
                  {singleJob.jobType}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="p-6 space-y-6 md:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-500 h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">
                  {singleJob?.location || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="text-gray-500 h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Experience</h3>
                <p className="text-gray-600">
                  {typeof singleJob?.experienceLevel === "number"
                    ? `${singleJob.experienceLevel} years`
                    : singleJob?.experienceLevel || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-gray-500 h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Posted Date</h3>
                <p className="text-gray-600">
                  {singleJob?.createdAt
                    ? formatDate(singleJob.createdAt)
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-gray-500 h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Applicants</h3>
                <p className="text-gray-600">
                  {singleJob?.applications?.length || 0} applicants
                </p>
              </div>
            </div>
          </div>

          {/* Job Requirements Section */}
          {singleJob?.requirements && singleJob.requirements.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Requirements
              </h2>
              <ul className="pl-5 text-gray-600 list-disc sm:text-base md:text-lg">
                {singleJob.requirements
                  .slice(0, 6)
                  .map((req: string, index: number) => (
                    <li key={index} className="whitespace-normal">
                      {req}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Job Description Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Job Description
            </h2>
            <p className="text-gray-600 mt-3">{singleJob?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
