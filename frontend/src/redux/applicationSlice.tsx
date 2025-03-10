import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  appliedAt: string;
  job: string;
  applicant: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    profile?: {
      resume?: string;
      resumeOriginalName?: string;
    };
    createdAt?: string;
  };
  status: string;
  createdAt: string;
  [key: string]: unknown;
}


interface ApplicationState {
  applicants: Applicant[]; // Changed from Applicant[] | null to just Applicant[]
}

const initialState: ApplicationState = {
  applicants: [], // Changed from null to empty array
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAllApplicants: (state, action: PayloadAction<Applicant[]>) => {
      state.applicants = action.payload;
      console.log("Applicants set in Redux:", action.payload);
    },
    updateApplicationStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const index = state.applicants.findIndex(
        (app) => app._id === action.payload.id
      );
      if (index !== -1) {
        state.applicants[index].status = action.payload.status;
      }
    },
  },
});

export const { setAllApplicants, updateApplicationStatus } =
  applicationSlice.actions;
export default applicationSlice.reducer;
