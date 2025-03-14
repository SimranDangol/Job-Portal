import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, FileText, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/app/store";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { Textarea } from "../ui/textarea";

// Import the User type from authSlice to ensure consistency
interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  role: string;
  profilePicture: string;
  profile: {
    bio?: string;
    skills?: string[];
    [key: string]: any;
  };
  resume?: string;
  resumeOriginalName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  savedJobs: string[]; // Changed from optional to required
}

interface UpdateProfileDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormDataType {
  name: string;
  email: string;
  number: string; // Keep as string for form handling
  bio: string;
  skills: string;
  file: File | null;
  currentResume: string;
  removeResume: boolean;
}

const UpdateProfileDialog: React.FC<UpdateProfileDialogProps> = ({
  open,
  setOpen,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  // Function to extract filename from URL
  const getResumeFilename = (url: string): string => {
    if (!url) return "";
    return url.split("/").pop() || "";
  };

  // State for form data
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    number: "",
    bio: "",
    skills: "",
    file: null,
    currentResume: "",
    removeResume: false,
  });

  // Update form when user data changes or dialog opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || "",
        email: user.email || "",
        number: user.phoneNumber?.toString() || "", // Convert number to string for the form
        bio: user.profile?.bio?.toString() || "", // Ensure bio is a string
        skills: Array.isArray(user.profile?.skills)
          ? user.profile.skills.join(", ")
          : "", // Check if skills is an array
        file: null,
        currentResume: user.resume || "",
        removeResume: false,
      });
    }
  }, [open, user]);

  // Handle input changes
  const changeEventHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
  };

  // Remove current resume
  const handleRemoveResume = () => {
    setFormData({
      ...formData,
      currentResume: "",
      removeResume: true,
    });
  };

  // Clear selected file
  const clearSelectedFile = () => {
    setFormData({ ...formData, file: null });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.number);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("skills", formData.skills);

    // Handle resume file upload or removal
    if (formData.file) {
      formDataToSend.append("resume", formData.file);
    }

    // Add flag for resume removal - ensure this is sent to the backend
    if (formData.removeResume) {
      formDataToSend.append("removeResume", "true");
    }

    try {
      const res = await axios.patch(
        "/api/v1/user/update-profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // The updated user data is in res.data.data, not res.data.user
        if (user) {
          // Create a properly merged user object
          const updatedUser: User = {
            ...user, // Keep all existing user data
            fullName: res.data.data.fullName,
            email: res.data.data.email,
            phoneNumber: res.data.data.phoneNumber,
            profile: res.data.data.profile,
            resume: res.data.data.resume,
            resumeOriginalName: res.data.data.resumeOriginalName,
            updatedAt: res.data.data.updatedAt,
            // Ensure savedJobs is always an array
            savedJobs: res.data.data.savedJobs || user.savedJobs || [],
          };

          // Update the Redux store with merged user data
          dispatch(setUser(updatedUser));
        }

        // Show success message and close dialog
        toast.success("Profile updated successfully");
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Update error:", error);
      let errorMessage = "Failed to update profile";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => !loading && setOpen(newOpenState)}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={changeEventHandler}
              required
              className="w-full"
            />
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={changeEventHandler}
              required
              className="w-full"
            />
          </div>

          {/* Phone number field */}
          <div className="space-y-1.5">
            <Label htmlFor="number" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="number"
              name="number"
              type="tel"
              value={formData.number}
              onChange={changeEventHandler}
              className="w-full"
            />
          </div>

          {/* Bio field */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              className="w-full h-20 resize-none"
              value={formData.bio}
              onChange={changeEventHandler}
              placeholder="Brief description about yourself"
            />
          </div>

          {/* Skills field */}
          <div className="space-y-1.5">
            <Label htmlFor="skills" className="text-sm font-medium">
              Skills
            </Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={changeEventHandler}
              placeholder="React, TypeScript, Node.js (comma separated)"
              className="w-full"
            />
          </div>

          {/* Resume section */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Resume</Label>

            {/* Current resume display */}
            {formData.currentResume && !formData.removeResume ? (
              <div className="mb-2">
                <div className="flex items-center gap-2 p-2 text-sm border rounded-md bg-blue-50">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <a
                    href={formData.currentResume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-xs text-blue-600 truncate hover:underline"
                  >
                    {user?.resumeOriginalName ||
                      getResumeFilename(formData.currentResume)}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveResume}
                    className="w-6 h-6 text-gray-500 hover:text-red-500"
                    title="Remove resume"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-2">
                {/* Show file input only when no resume exists or it was removed */}
                {formData.file ? (
                  <div className="flex items-center gap-2 p-2 text-sm border rounded-md bg-blue-50">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="flex-1 text-xs truncate">
                      {formData.file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearSelectedFile}
                      className="w-6 h-6 text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept="application/pdf"
                      className="w-full cursor-pointer"
                      onChange={fileChangeHandler}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload PDF resume (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              size="sm"
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="w-24 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;


