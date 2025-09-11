// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

import authReducer, { type AuthState } from "./slices/authSlice";
import tablePrefsReducer from "./slices/tablePrefs.slice";

const authPersistConfig = {
  key: "auth",
  storage,
  // whitelist: ["token", "user"] // si quieres granularidad
};

const rootReducer = combineReducers({
  auth: persistReducer<AuthState>(authPersistConfig, authReducer),
  tablePrefs: tablePrefsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gdm) => gdm({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// Tipos globales
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🔑 Reexportamos AuthState para que TS no se queje con TS4023
export type { AuthState };
