import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the state
interface Company {
  _id: string;
  name: string;
  logo: string;
  createdAt: string;
}

interface CompanyState {
  singleCompany: Company | null;
  companies: Company[];
  searchCompanyByText: string;
}

// Initial state with types
const initialState: CompanyState = {
  singleCompany: null,
  companies: [],
  searchCompanyByText: "",
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSingleCompany: (state, action: PayloadAction<Company | null>) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText: (state, action: PayloadAction<string>) => {
      state.searchCompanyByText = action.payload;
    },
  },
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } =
  companySlice.actions;
export default companySlice.reducer;
