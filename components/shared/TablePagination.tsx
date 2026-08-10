"use client";

import type { ReactElement } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  formatSummary: (values: {
    start: number;
    end: number;
    total: number;
    page: number;
    pages: number;
  }) => string;
  className?: string;
}

export function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  previousLabel,
  nextLabel,
  formatSummary,
  className,
}: TablePaginationProps): ReactElement | null {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) {
    return null;
  }

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-xs text-text-muted">
        {formatSummary({
          start,
          end,
          total: totalItems,
          page: safePage,
          pages: totalPages,
        })}
      </p>
      <div className="flex items-center gap-2">
        <MainButton
          variant="neutral"
          size="sm"
          disabled={safePage <= 1}
          startIcon={<PreviousIcon className="size-4" />}
          onClick={() => onPageChange(safePage - 1)}
        >
          {previousLabel}
        </MainButton>
        <MainButton
          variant="neutral"
          size="sm"
          disabled={safePage >= totalPages}
          endIcon={<NextIcon className="size-4" />}
          onClick={() => onPageChange(safePage + 1)}
        >
          {nextLabel}
        </MainButton>
      </div>
    </div>
  );
}
