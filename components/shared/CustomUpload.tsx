"use client";

import { useCallback, useEffect, useId, useRef, useState, type DragEvent, type ReactElement } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import { cn } from "@/lib/utils";

const ACCEPT =
  ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";

interface CustomUploadProps {
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  value?: File;
  onChange: (file: File | undefined) => void;
  dropLabel: string;
  browseLabel: string;
  supportedFormatsLabel: string;
  removeLabel: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CustomUpload({
  label,
  hint,
  error,
  disabled = false,
  value,
  onChange,
  dropLabel,
  browseLabel,
  supportedFormatsLabel,
  removeLabel,
}: CustomUploadProps): ReactElement {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null | undefined): void => {
      const file = files?.[0];
      if (!file || disabled) return;
      onChange(file);
    },
    [disabled, onChange]
  );

  const onDragEnter = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setDragActive(true);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setDragActive(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  useEffect(() => {
    if (disabled) {
      setDragActive(false);
    }
  }, [disabled]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      {label ? (
        <span className="ms-1 text-xs font-medium text-text-secondary">{label}</span>
      ) : null}

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-xs">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-jade-50 text-jade-700">
            <FileSpreadsheet className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{value.name}</p>
            <p className="text-xs text-text-muted">{formatFileSize(value.size)}</p>
          </div>
          <MainButton
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={removeLabel}
            disabled={disabled}
            onClick={() => onChange(undefined)}
            className="shrink-0 text-text-muted hover:text-danger-600"
          >
            <X className="size-4" />
          </MainButton>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          onKeyDown={(event) => {
            if (disabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => {
            if (!disabled) inputRef.current?.click();
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors",
            "border-border bg-surface-muted/40 hover:border-primary-300 hover:bg-primary-50/40",
            dragActive && "border-primary-400 bg-primary-50/60",
            disabled && "cursor-not-allowed opacity-60 hover:border-border hover:bg-surface-muted/40",
            error && "border-danger-400 bg-danger-50/30"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <Upload className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-medium text-ink">{dropLabel}</p>
            <p className="text-xs text-text-muted">
              {browseLabel} · {supportedFormatsLabel}
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {hint && !error ? <p className="text-xs text-text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
