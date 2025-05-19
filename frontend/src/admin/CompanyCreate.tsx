import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSingleCompany } from "@/redux/companySlice";

// API Response type
interface ApiResponse {
  success: boolean;
  message: string;
  data: { _id: string };
}

const CompanyCreate: FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const company = res.data.data;

      if (res.data.success && company?._id) {
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
    } catch (error) {
      const err = error as AxiosError<any>;
      console.error("Error registering company:", err);
      toast.error(err.response?.data?.message || "Failed to register company");
      navigate("/admin/companies");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Your Company Name
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            What would you like to name your company?
          </p>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium">Company Name</Label>
          <Input
            type="text"
            placeholder="JobHunt, Microsoft, etc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/companies")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={registerNewCompany} disabled={isLoading}>
            {isLoading ? "Registering..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
