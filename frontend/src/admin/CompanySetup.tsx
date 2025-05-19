import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useGetCompanyById from "@/hooks/useGetCompanybyId";
import { setSingleCompany } from "@/redux/companySlice";

interface CompanySetupInput {
  name: string;
  description: string;
  website: string;
  location: string;
  file: File | null;
}

const CompanySetup: React.FC = () => {
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleCompany } = useSelector((state: any) => state.company);

  const [input, setInput] = useState<CompanySetupInput>({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useGetCompanyById(params.id!);

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null, // Reset file input
      });
    }
  }, [singleCompany]);

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setInput({ ...input, file });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setIsLoading(true);
      const res = await axios.put(`/api/v1/company/update/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data.data) {
          dispatch(setSingleCompany(res.data.data));
        }
        toast.success(res.data.message || "Company updated successfully");
        navigate("/admin/companies");
      } else {
        toast.error(res.data.message || "Failed to update company");
      }
    } catch (error: any) {
      console.error("Error updating company:", error);
      toast.error(error.response?.data?.message || "Failed to update company");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl px-4 sm:px-6 lg:px-8 mx-auto my-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
        <Button
          type="button"
          onClick={() => navigate("/admin/companies")}
          variant="outline"
          className="flex items-center gap-2 font-semibold text-gray-500"
        >
          <ArrowLeft />
          <span>Back</span>
        </Button>
        <h1 className="text-xl font-bold">Company Setup</h1>
      </div>

      {/* Form Section */}
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Company Name</Label>
            <Input type="text" name="name" value={input.name} onChange={changeEventHandler} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} />
          </div>
          <div>
            <Label>Website</Label>
            <Input type="text" name="website" value={input.website} onChange={changeEventHandler} />
          </div>
          <div>
            <Label>Location</Label>
            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
          </div>
          <div className="sm:col-span-2">
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={changeFileHandler} />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CompanySetup;