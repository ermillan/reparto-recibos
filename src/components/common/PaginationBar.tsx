// src/components/common/PaginationBar.tsx
import * as React from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPerPage, setPerPage } from "@/store/slices/tablePrefs.slice";

// ⬇️ Usa SIEMPRE los componentes de tu UI (shadcn)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PaginationBarProps = {
  total: number;
  page: number; // 1-based
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  sizeOptions?: number[]; // opciones del select
  className?: string;
};

const PaginationBar: React.FC<PaginationBarProps> = ({
  total,
  page,
  onPageChange,
  isLoading = false,
  sizeOptions = [10, 20, 50],
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const perPage = useAppSelector(selectPerPage);

  // asegura que perPage esté en la lista
  const options = React.useMemo(() => {
    const set = new Set(sizeOptions);
    set.add(perPage);
    return Array.from(set).sort((a, b) => a - b);
  }, [sizeOptions, perPage]);

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / (perPage || 1)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, total ?? 0);

  const handlePerPageChange = (value: string) => {
    const n = Number(value);
    if (!Number.isNaN(n) && n > 0) {
      dispatch(setPerPage(n));
      onPageChange(1); // siempre vuelve a la primera
    }
  };

  React.useEffect(() => {
    if (page > totalPages) onPageChange(totalPages);
  }, [totalPages]);

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between gap-3 ${className}`}>
      {/* Items por página (SELECT real) */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Items por página:</span>
        <Select value={String(perPage)} onValueChange={handlePerPageChange} disabled={isLoading}>
          <SelectTrigger className="w-[96px] h-10 tabular-nums">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-[--radix-select-trigger-width]">
            {options.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rango visible */}
      <div className="text-sm text-muted-foreground">
        {total === 0 ? 0 : startIndex} – {endIndex} de {total}
      </div>

      {/* Controles */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => onPageChange(1)}
          disabled={!canPrev || isLoading}
          aria-label="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!canPrev || isLoading}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!canNext || isLoading}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext || isLoading}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationBar;
