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

      // Debug API response
      console.log("API Response:", res.data);

      const company = res?.data?.data; // Ensure we're getting the company data

      if (res?.data?.success && company?._id) {
        dispatch(setSingleCompany({
          _id: company._id,
          name: companyName,
          logo: "", // Add appropriate value or fetch from response if available
          createdAt: new Date().toISOString() // Add appropriate value or fetch from response if available
        }));
        toast.success(res.data.message || "Company registered successfully");

        // Navigate directly to the company page without "setup"
        navigate(`/admin/companies/${company._id}`);
      } else {
        // In case of missing company data
        toast.error("Failed to register company, please try again.");
        navigate("/admin/companies");
      }
    } catch (error: any) {
      console.error("Error registering company:", error);
      toast.error(
        error.response?.data?.message || "Failed to register company"
      );
      navigate("/admin/companies");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Your Company Name</h1>
          <p className="mt-2 text-gray-500">
            What would you like to name your company?
          </p>
        </div>
        <div className="mb-6">
          <Label className="text-sm font-medium">Company Name</Label>
          <Input
            type="text"
            className="w-full p-3 mt-2 text-lg"
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
            className="w-full py-3 text-lg sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={registerNewCompany}
            disabled={isLoading}
            className="w-full py-3 text-lg sm:w-auto"
          >
            {isLoading ? "Registering..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
