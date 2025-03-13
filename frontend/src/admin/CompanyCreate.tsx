import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Type for the API response structure
interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
  };
}

const CompanyCreate: React.FC = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState<string>("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post<ApiResponse>(
        "/api/v1/company/register",
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const company = res?.data?.data;

      if (res?.data?.success && company?._id) {
        dispatch(
          setSingleCompany({
            _id: company._id,
            name: companyName,
            logo: "",
            createdAt: new Date().toISOString(),
          })
        );
        toast.success(res.data.message || "Company registered successfully");
        navigate(`/admin/companies/${company._id}`);
      } else {
        toast.error("Failed to register company, please try again.");
        navigate("/admin/companies");
      }
    } catch (error: any) {
      console.error("Error registering company:", error);
      toast.error(error.response?.data?.message || "Failed to register company");
      navigate("/admin/companies");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Your Company Name</h1>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            What would you like to name your company?
          </p>
        </div>
        <div className="mb-6">
          <Label className="text-sm font-medium">Company Name</Label>
          <Input
            type="text"
            className="w-full p-3 mt-2 text-base"
            placeholder="JobHunt, Microsoft etc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={registerNewCompany}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 text-base"
          >
            {isLoading ? "Registering..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
