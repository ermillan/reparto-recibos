import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  token: string | null;
  user: any | null;
  mustChangePassword?: boolean;
} = {
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
      action: PayloadAction<{ token: string; user: any; mustChangePassword?: boolean }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.mustChangePassword = Boolean(action.payload.mustChangePassword);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
