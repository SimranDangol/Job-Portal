import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Applicant {
  _id: string;
  job: string;
  applicant: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    resume?: string;
    profile?: {
      resume?: string;
      resumeOriginalName?: string;
    };
    createdAt?: string;
  };
  status: "pending" | "approved" | "disapproved";
  createdAt: string;
  updatedAt?: string;
}

interface ApplicationState {
  applicants: Applicant[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applicants: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setAllApplicants: (state, action: PayloadAction<Applicant[]>) => {
      state.applicants = action.payload;
      state.loading = false;
      state.error = null;
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
        state.applicants[index].status = action.payload
          .status as Applicant["status"];
        console.log(
          `Updated application ${action.payload.id} status to ${action.payload.status}`
        );
      } else {
        console.warn(
          `Application with id ${action.payload.id} not found for status update`
        );
      }
    },

    // Add new applicant (if needed)
    addApplicant: (state, action: PayloadAction<Applicant>) => {
      state.applicants.push(action.payload);
      console.log("New applicant added:", action.payload);
    },

    // Remove applicant (if needed for withdraw functionality)
    removeApplicant: (state, action: PayloadAction<string>) => {
      state.applicants = state.applicants.filter(
        (app) => app._id !== action.payload
      );
      console.log("Applicant removed:", action.payload);
    },

    // Clear all applicants
    clearApplicants: (state) => {
      state.applicants = [];
      state.loading = false;
      state.error = null;
      console.log("All applicants cleared");
    },
  },
});

export const {
  setLoading,
  setError,
  setAllApplicants,
  updateApplicationStatus,
  addApplicant,
  removeApplicant,
  clearApplicants,
} = applicationSlice.actions;

export default applicationSlice.reducer;
