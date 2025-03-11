import React, { useState } from "react";
import { Contact, Mail, Pen, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AppliedJobTable from "./AppliedJob";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import UpdateProfileDialog from "./UpdateProfile";
import useGetAppliedJobs from "@/hooks/useGetAppliedJob";

interface UserProfile {
  bio?: string;
  skills?: string[];
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  role: string;
  profilePicture: string;
  profile?: UserProfile;
  resume?: string;
  resumeOriginalName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Profile: React.FC = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth) as { user: User | null };

  const getResumeFilename = (filename?: string) => filename || "See Resume";

  return (
    <div className="container max-w-3xl p-4 mx-auto">
      {/* Profile Card */}
      <div className="p-5 bg-white rounded-lg shadow-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border border-gray-300">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="text-lg font-bold bg-gray-100">
                {user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{user?.fullName || "Unknown User"}</h1>
              <p className="text-sm text-gray-600">{user?.profile?.bio || "No bio available"}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline" className="gap-2 text-sm">
            <Pen size={16} /> Edit
          </Button>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Mail className="text-blue-500" size={18} />
            <span className="text-sm text-gray-800 break-all">{user?.email || "No email provided"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Contact className="text-blue-500" size={18} />
            <span className="text-sm text-gray-800">{user?.phoneNumber || "Not provided"}</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-4">
          <Label className="text-sm font-semibold">Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.profile?.skills?.length ? (
              user.profile.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No skills added</span>
            )}
          </div>
        </div>

        {/* Resume Section */}
        <div className="mt-4">
          <Label className="text-sm font-semibold">Resume</Label>
          <div className="mt-1">
            {user?.resume ? (
              <a href={user.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1 text-sm text-blue-600 border border-gray-300 rounded-md shadow-sm hover:bg-blue-50">
                <FileText size={16} />
                {getResumeFilename(user?.resumeOriginalName)}
              </a>
            ) : (
              <span className="text-sm text-gray-500">Not uploaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="p-5 mt-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Applied Jobs</h2>
        <AppliedJobTable />
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;