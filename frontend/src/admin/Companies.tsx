import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CompaniesTables from "./CompaniesTables";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies: FC = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetAllCompanies();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearchCompanyByText(input));
    }, 300); // debounce user input
    return () => clearTimeout(timeout);
  }, [input, dispatch]);

  return (
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto my-8">
      {/* Top Bar */}
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
          className="w-full sm:w-auto"
        >
          New Company
        </Button>
      </div>

      {/* Companies Table */}
      <CompaniesTables />
    </div>
  );
};

export default Companies;
