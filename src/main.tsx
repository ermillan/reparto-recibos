import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/presentation/router/AppRouter";
import "./styles.css";
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster richColors />
    <BrowserRouter basename="/FrontRepartoRecibos">
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
