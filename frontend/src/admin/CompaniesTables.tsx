import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { setSearchCompanyByText } from "@/redux/companySlice";

interface Company {
  _id: string;
  logo: string;
  name: string;
  createdAt: string;
}

const CompaniesTables: React.FC = () => {
  const { companies, searchCompanyByText } = useSelector(
    (state: any) => state.company
  );
  const dispatch = useDispatch();
  const [filterCompany, setFilterCompany] = useState<Company[]>(companies);

  useEffect(() => {
    setFilterCompany(
      companies.filter((company: Company) =>
      searchCompanyByText
        ? company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase())
        : true
      )
    );
  }, [companies, searchCompanyByText]);

  return (
    <div className="max-w-3xl mx-auto overflow-hidden bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Companies</h2>
        <Input
          className="w-56 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name..."
          onChange={(e) => dispatch(setSearchCompanyByText(e.target.value))}
          value={searchCompanyByText}
        />
      </div>

      <Table className="w-full">
        <TableCaption className="py-3 text-sm text-gray-500">
          Recently registered companies
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-24 text-center">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-32 text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.length > 0 ? (
            filterCompany.map((company) => (
              <TableRow
                key={company._id}
                className="transition cursor-pointer hover:bg-blue-50"
              >
                <TableCell className="text-center">
                  <Avatar className="w-12 h-12 mx-auto border border-gray-200 shadow-sm">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback>
                      <Building className="w-6 h-6 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-lg font-medium text-gray-800">
                  {company.name}
                </TableCell>
                <TableCell className="text-sm text-right text-gray-500">
                  {new Date(company.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-16 text-sm text-center text-gray-500"
              >
                No companies found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTables;
