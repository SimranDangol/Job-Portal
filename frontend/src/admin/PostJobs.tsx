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
  category: string; // Added category field
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
  "Hospitality & Tourism",
  "Education & Teaching",
  "Web Developer",
  "Data Scientist",
  "Accounting",
  "Graphic Designer",
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
    category: "", // Initialize category
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
          experience: parseInt(input.experience), // Parse experience as a number
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
          requirements: res.data.data.requirements.join("\n"), // Join with newlines instead of commas
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
    <div className="flex items-center justify-center w-full my-5">
      <form
        onSubmit={submitHandler}
        className="max-w-4xl p-8 transition-all duration-300 bg-white border border-gray-300 rounded-lg shadow-xl hover:shadow-2xl"
      >
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Post New Job
        </h2>

        <div className="flex items-center justify-between mb-6">
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
            className="flex items-center gap-2 text-gray-700 border-gray-500 hover:bg-gray-100"
          >
            {generatingAI ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Now
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Job Title */}
          <div>
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
          <div>
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

          {/* Basic Info Fields */}
          {[
            ["location", "Location"],
            ["jobType", "Job Type"],
            ["experience", "Experience Level"],
          ].map(([field, label]) => (
            <div key={field}>
              <Label className="font-medium text-gray-700">{label}</Label>
              <Input
                type="text"
                name={field}
                value={input[field as keyof JobInput] as string}
                onChange={changeEventHandler}
                className="mt-1 focus:ring-2 focus:ring-blue-500"
                placeholder={`e.g. ${
                  field === "location"
                    ? "Remote/New York"
                    : field === "jobType"
                    ? "Full-time/Contract"
                    : "Senior/3+ years"
                }`}
              />
            </div>
          ))}

          {/* Number of Positions */}
          <div>
            <Label className="font-medium text-gray-700">
              No. of Positions
            </Label>
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
            <div>
              <Label className="font-medium text-gray-700">
                Select Company
              </Label>
              <Select
                onValueChange={(value) => selectChangeHandler("company", value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company.name.toLowerCase()}
                      >
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
        <div className="mt-6">
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
        <div className="mt-6">
          <Label className="font-medium text-gray-700">Requirements</Label>
          <Textarea
            name="requirements"
            value={input.requirements}
            onChange={changeEventHandler}
            className="mt-2 min-h-24 focus:ring-2 focus:ring-blue-500"
            placeholder="List each requirement on a new line (e.g. Bachelor's degree in Computer Science, Information Technology, or a related field, or equivalent demonstrable experience.)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter each requirement on a new line. For requirements with multiple
            options, keep them on the same line.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full py-3 mt-6 text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Post New Job"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
