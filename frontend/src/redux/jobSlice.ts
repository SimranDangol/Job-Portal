import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface Job {
  _id: string;
  title: string;
  company: {
    _id: string;
    name: string;
    logo?: string;
  };
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
  description: string;
  jobType: string;
  location: string;
  category: string;
  experienceLevel: number;
  viewMode: "grid" | "list"; 
  position: string;
  applications?: Array<{ applicant: string; _id?: string }>;
  requirements?: string[]; // Added requirements field
}

interface JobState {
  allJobs: Job[];
  allAdminJobs: Job[];
  singleJob: Job | null;
  searchJobByText: string;
  allAppliedJobs: {
    _id: string;
    job: Job;
    createdAt: string;
    status: "pending" | "approved" | "rejected";
  }[];
  searchedQuery: string;
  selectedCategory: string;
  selectedLocation: string;
  selectedIndustry: string;
}

const initialState: JobState = {
  allJobs: [],
  allAdminJobs: [],
  singleJob: null,
  searchJobByText: "",
  allAppliedJobs: [],
  searchedQuery: "",
  selectedCategory: "All", 
  selectedLocation: "All", 
  selectedIndustry: "All", 
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setAllJobs: (state, action: PayloadAction<Job[]>) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action: PayloadAction<Job | null>) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action: PayloadAction<Job[]>) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action: PayloadAction<string>) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (
      state,
      action: PayloadAction<{
        _id: string;
        job: Job;
        createdAt: string;
        status: "pending" | "approved" | "rejected";
      }[]>
    ) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action: PayloadAction<string>) => {
      state.searchedQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      console.log("Category updated in Redux store:", state.selectedCategory);
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload;
    },
    setSelectedIndustry: (state, action: PayloadAction<string>) => {
      state.selectedIndustry = action.payload;
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSelectedCategory,
  setSelectedLocation,
  setSelectedIndustry,
} = jobSlice.actions;

export default jobSlice.reducer;