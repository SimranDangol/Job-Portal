import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// TypeScript interfaces
interface Company {
  _id: string;
  name: string;
}

interface JobInput {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  experience: string;
  position: number;
  companyId: string;
  category: string;
  useAI: boolean;
}

interface RootState {
  company: {
    companies: Company[];
  };
}

// Available categories (matching those in Category.tsx)
const categories = [
  "Information Technology",
  "Business & Finance",
  "Digital Marketing",
  "Education & Teaching",
  "Accounting",
  "Graphic Designer",
  "Sales",
];

const PostJob: React.FC = () => {
  const [input, setInput] = useState<JobInput>({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
    category: "",
    useAI: false,
  });
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store: RootState) => store.company);

  const changeEventHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (field: string, value: string) => {
    if (field === "company") {
      const selectedCompany = companies.find(
        (company) => company.name.toLowerCase() === value
      );
      if (selectedCompany) {
        setInput({ ...input, companyId: selectedCompany._id });
      }
    } else if (field === "category") {
      setInput({ ...input, category: value });
    }
  };

  const toggleAI = (checked: boolean) => {
    setInput({ ...input, useAI: checked });
  };

  const generateAIContent = async () => {
    if (!input.title || !input.experience) {
      toast.error("Please enter both a job title and experience level first");
      return;
    }

    try {
      setGeneratingAI(true);
      const res = await axios.post(
        `/api/v1/job/generate-ai-content`,
        {
          jobTitle: input.title,
          experience: parseInt(input.experience),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setInput({
          ...input,
          description: res.data.data.description,
          requirements: res.data.data.requirements.join("\n"),
        });
        toast.success("AI content generated successfully");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to generate AI content"
      );
    } finally {
      setGeneratingAI(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format requirements for submission - split by newlines and trim
    const formattedRequirements = input.requirements
      .split("\n")
      .map((req) => req.trim())
      .filter((req) => req.length > 0);

    try {
      setLoading(true);
      const res = await axios.post(
        `/api/v1/job/post`,
        {
          ...input,
          requirements: formattedRequirements,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4 py-5 sm:px-6 md:px-8">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-4xl p-4 sm:p-6 md:p-8 transition-all duration-300 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl"
      >
        <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold text-center text-gray-800">
          Post New Job
        </h2>

        {/* AI Section */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-toggle"
              checked={input.useAI}
              onCheckedChange={toggleAI}
            />
            <Label htmlFor="ai-toggle" className="font-medium text-gray-700">
              Use AI to generate job content
            </Label>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={generateAIContent}
            disabled={!input.title || !input.experience || generatingAI}
            className="flex items-center justify-center gap-2 text-gray-700 border-gray-500 hover:bg-gray-100 w-full sm:w-auto"
          >
            {generatingAI ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Now
          </Button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Job Title */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Label className="font-medium text-gray-700">Job Title</Label>
            <Input
              type="text"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              className="mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Senior React Developer"
            />
          </div>

          {/* Job Category */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Label className="font-medium text-gray-700">Job Category</Label>
            <Select
              onValueChange={(value) => selectChangeHandler("category", value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label className="font-medium text-gray-700">Location</Label>
            <Input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              className="mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Kathmandu"
            />
          </div>

          {/* Job Type */}
          <div>
            <Label className="font-medium text-gray-700">Job Type</Label>
            <Input
              type="text"
              name="jobType"
              value={input.jobType}
              onChange={changeEventHandler}
              className="mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Full-time/Part-time"
            />
          </div>

          {/* Experience Level */}
          <div>
            <Label className="font-medium text-gray-700">Experience Level</Label>
            <Input
              type="text"
              name="experience"
              value={input.experience}
              onChange={changeEventHandler}
              className="mt-1 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 3"
            />
          </div>

          {/* Number of Positions */}
          <div>
            <Label className="font-medium text-gray-700">No. of Positions</Label>
            <Input
              type="number"
              name="position"
              value={input.position}
              onChange={changeEventHandler}
              className="mt-1 focus:ring-2 focus:ring-blue-500"
              min={1}
            />
          </div>

          {/* Company Selection */}
          {companies.length > 0 && (
            <div className="col-span-1 sm:col-span-2">
              <Label className="font-medium text-gray-700">Select Company</Label>
              <Select
                onValueChange={(value) => selectChangeHandler("company", value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company.name.toLowerCase()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="mt-4 sm:mt-6">
          <Label className="font-medium text-gray-700">Job Description</Label>
          <Textarea
            name="description"
            value={input.description}
            onChange={changeEventHandler}
            className="mt-2 min-h-32 focus:ring-2 focus:ring-blue-500"
            placeholder="Provide a detailed description of the job role and responsibilities"
          />
        </div>

        {/* Job Requirements */}
        <div className="mt-4 sm:mt-6">
          <Label className="font-medium text-gray-700">Requirements</Label>
          <Textarea
            name="requirements"
            value={input.requirements}
            onChange={changeEventHandler}
            className="mt-2 min-h-32 focus:ring-2 focus:ring-blue-500"
            placeholder="List job requirements (separate by new lines)"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center sm:justify-end mt-6 sm:mt-8">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-32 py-2 text-white bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;