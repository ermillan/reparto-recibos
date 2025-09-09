// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import tablePrefsReducer from "./slices/tablePrefs.slice";

const authPersistConfig = {
  key: "auth",
  storage,
  // whitelist: ["token","user"] // si quieres granularidad
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tablePrefs: tablePrefsReducer, // no persistido
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gdm) => gdm({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
