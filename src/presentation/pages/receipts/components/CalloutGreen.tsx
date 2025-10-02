import { ACCEPTED_TYPES, MAX_SIZE_MB } from "@/application/archive/archive.config";
import { Info } from "lucide-react";

const CalloutGreen = () => {
  return (
    <section className="mx-auto mt-6 max-w-3xl rounded-xl border bg-emerald-50 p-4 text-emerald-800">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-emerald-600/10 p-1.5 text-emerald-700">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium">Instrucciones importantes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Solo se deben subir archivos con recibos de tipo <b>FIS</b>.
            </li>
            <li>
              El archivo no debe pesar más de <b>{MAX_SIZE_MB}MB</b>.
            </li>
            <li>Formatos permitidos: {ACCEPTED_TYPES.join(", ")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CalloutGreen;
