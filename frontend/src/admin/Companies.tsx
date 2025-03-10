import React, { useEffect, useState } from "react";
import CompaniesTables from "./CompaniesTables";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { useDispatch } from "react-redux";

const Companies: React.FC = () => {
  useGetAllCompanies(); // Assuming this hook fetches all companies
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="max-w-4xl px-6 mx-auto my-8 sm:px-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search companies"
          className="px-4 py-2 border rounded"
        />
        <Button
          size="lg"
          onClick={() => navigate("/admin/companies/create")}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          New Company
        </Button>
      </div>

      <CompaniesTables />
    </div>
  );
};

export default Companies;
