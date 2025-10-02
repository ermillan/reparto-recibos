import React, { useState } from "react";
import NewReceiptTab from "./components/NewReceiptTab";
import UploadedReceiptsTab from "./components/UploadedReceiptsTab";
import { classNames } from "@/lib/utils/classNames";

type TabKey = "uploaded" | "new";

export default function ReceiptUploadPage() {
  const [tab, setTab] = useState<TabKey>("new");

  return (
    <div className="w-full">
      <header className="mx-auto max-w-6xl px-4 pt-6">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 text-sm">
          <button
            className={classNames(
              "border-b-2 pb-2 transition-colors",
              tab === "new"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab("new")}
          >
            Carga de archivo(s)
          </button>
          <button
            className={classNames(
              "border-b-2 pb-2 transition-colors",
              tab === "uploaded"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab("uploaded")}
          >
            Archivo(s) ya cargado(s)
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-6">
        {tab === "new" ? <NewReceiptTab /> : <UploadedReceiptsTab />}
      </main>
    </div>
  );
}
