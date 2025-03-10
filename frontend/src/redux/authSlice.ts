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
}

interface AuthState {
  loading: boolean;
  user: User | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      console.log('Setting user in Redux:', action.payload);
      state.user = action.payload;
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;