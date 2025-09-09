import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TablePrefsState = {
  perPage: number;
};

const initialState: TablePrefsState = {
  perPage: 20, // default
};

const tablePrefsSlice = createSlice({
  name: "tablePrefs",
  initialState,
  reducers: {
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
  },
});

export const { setPerPage } = tablePrefsSlice.actions;
export default tablePrefsSlice.reducer;

// Selectors
export const selectPerPage = (s: { tablePrefs: TablePrefsState }) => s.tablePrefs.perPage;
