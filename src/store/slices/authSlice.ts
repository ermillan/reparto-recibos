// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  // agrega más campos reales si los tienes
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  mustChangePassword: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  mustChangePassword: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser; mustChangePassword?: boolean }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.mustChangePassword = Boolean(action.payload.mustChangePassword);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.mustChangePassword = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
