import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  role: string;
  profilePicture: string;
  profile: Record<string, unknown>;
  resume?: string;
  resumeOriginalName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  savedJobs: string[];
}

interface AuthState {
  loading: boolean;
  user: User | null;
}

const savedUserData = localStorage.getItem("user");
let parsedUser = null;

if (savedUserData) {
  try {
    parsedUser = JSON.parse(savedUserData);

    if (!parsedUser.savedJobs) {
      parsedUser.savedJobs = [];
    }
  } catch (e) {
    console.error("Error parsing saved user data:", e);
    localStorage.removeItem("user");
  }
}

const initialState: AuthState = {
  loading: false,
  user: parsedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      console.log("Setting user in Redux:", action.payload);

      if (action.payload && !action.payload.savedJobs) {
        action.payload.savedJobs = [];
      }

      state.user = action.payload;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setSavedJobs: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.savedJobs = action.payload;

        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setLoading, setUser, setSavedJobs, logout } = authSlice.actions;
export default authSlice.reducer;
