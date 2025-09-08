import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/presentation/router/AppRouter";
import "./styles.css";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster richColors />
        <BrowserRouter basename="/FrontRepartoRecibos">
          <AppRouter />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
