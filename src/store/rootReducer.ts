import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import tablePrefsReducer from "./slices/tablePrefs.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  tablePrefs: tablePrefsReducer,
});

export type RootReducer = ReturnType<typeof rootReducer>;
