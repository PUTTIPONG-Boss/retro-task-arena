import React, { ReactNode, useState, useEffect } from "react";
import PixelFrame from "@/components/PixelFrame";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: ReactNode;
  accessor?: keyof T | ((item: T) => ReactNode);
  className?: string;
  headerClassName?: string;
}

interface PixelTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  rowKeyExtractor?: (item: T, index: number) => string | number;
}

const PixelTable = <T,>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 6,
  onRowClick,
  className = "",
  emptyMessage = "No data found",
  rowKeyExtractor,
}: PixelTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const slicedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <PixelFrame variant="dark" className={cn("relative p-6 overflow-x-auto", className)}>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#333] text-muted-foreground uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={cn("p-3 font-semibold", col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {Array.from({ length: skeletonRows }).map((_, rIdx) => (
                  <tr key={rIdx} className="border-b border-[#333]/30">
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="p-3">
                        <div
                          className="h-4 rounded bg-white/10 animate-pulse"
                          style={{
                            width: cIdx === 2 ? "80%" : cIdx === columns.length - 1 ? "60%" : "50%",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-muted-foreground font-pixel">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              slicedData.map((item, rIdx) => (
                <tr
                  key={rowKeyExtractor ? rowKeyExtractor(item, rIdx) : rIdx}
                  className={cn(
                    "border-b border-[#333]/30 hover:bg-white/5 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col, cIdx) => {
                    let content: ReactNode = "";
                    if (col.accessor) {
                      if (typeof col.accessor === "function") {
                        content = col.accessor(item);
                      } else {
                        content = item[col.accessor] as ReactNode;
                      }
                    }
                    return (
                      <td key={cIdx} className={cn("p-3", col.className)}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </PixelFrame>

      {/* Retro Pixelated Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2 font-pixel text-sm bg-[#12141a] border border-[#333] select-none">
          <div className="text-muted-foreground">
            Showing <span className="text-foreground font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-foreground font-bold">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </span>{" "}
            of <span className="text-foreground font-bold">{data.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-1 bg-[#1a1c1e] text-foreground border border-[#333] hover:border-accent disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 active:scale-95",
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              ◀ Prev
            </button>
            <span className="text-muted-foreground px-2">
              Page <span className="text-accent font-bold">{currentPage}</span> of{" "}
              <span className="text-foreground font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "px-3 py-1 bg-[#1a1c1e] text-foreground border border-[#333] hover:border-accent disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 active:scale-95",
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              )}
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelTable;
