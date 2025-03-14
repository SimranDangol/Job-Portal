import React, { useEffect, useState } from "react";
import CompaniesTables from "./CompaniesTables";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { useDispatch } from "react-redux";

const Companies: React.FC = () => {
  useGetAllCompanies();
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto my-8">
      {/* Search and Button Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search companies"
          className="w-full sm:w-auto px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button
          size="lg"
          onClick={() => navigate("/admin/companies/create")}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          New Company
        </Button>
      </div>

      {/* Table Section */}
      <CompaniesTables />
    </div>
  );
};

export default Companies;
