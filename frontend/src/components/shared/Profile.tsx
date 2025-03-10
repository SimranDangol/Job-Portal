import React, { useState } from "react";
import { Contact, Mail, Pen } from "lucide-react";
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
    <div className="container p-4 mx-auto">
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user?.fullName || "Unknown User"}</h1>
                <p className="text-gray-600">
                  {typeof user?.profile?.bio === "string" ? user.profile.bio : "No bio available"}
                </p>
              </div>
            </div>
            <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center gap-2">
              <Pen size={16} />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" />
              <span>{user?.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Contact className="text-gray-400" />
              <span>{user?.phoneNumber || "Not provided"}</span>
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-lg font-semibold">Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0 ? (
                user.profile.skills.map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills added</span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-lg font-semibold">Resume</Label>
            {user?.resume ? (
              <Button variant="link" className="p-0">
                {getResumeFilename(user?.resumeOriginalName)}
              </Button>
            ) : (
              <span className="text-gray-500">Not uploaded</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Applied Jobs</h2>
        <AppliedJobTable />
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
