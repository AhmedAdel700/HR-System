"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactElement,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Fingerprint, History, Search, UploadCloud } from "lucide-react";
import { CustomUpload } from "@/components/shared/CustomUpload";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import { TablePagination } from "@/components/shared/TablePagination";
import {
  buildMonthOptions,
  buildYearOptions,
  fetchFingerprintImportMonth,
  submitFingerprintImport,
} from "@/lib/admin/fingerprintImportService";
import {
  getAllFingerprintImportMonthsSnapshot,
  getFingerprintImportMonthSnapshot,
  getFingerprintImportsVersionSnapshot,
  hydrateFingerprintImports,
  subscribeFingerprintImports,
} from "@/lib/admin/fingerprintImportStore";
import { searchFingerprintRecords } from "@/lib/admin/searchFingerprintRecords";
import { formatDateTime12, formatStoredDate, formatStoredTime12, resolveTimeLocale } from "@/lib/formatTime";
import type { FingerprintImportMonthData } from "@/types/FingerprintImportApiTypes";
import type { FingerprintAttendanceStatus } from "@/types/FingerprintImportApiTypes";
import { cn } from "@/lib/utils";

const RECORDS_PAGE_SIZE = 31;
const RECORDS_COLUMN_COUNT = 8;
const recordsTableColClass = "w-[12.5%] max-w-0";
const recordsTableHeaderClass =
  "truncate px-4 py-4 text-start text-xs font-semibold text-text-muted";
const recordsTableCellClass = "truncate px-4 py-3 text-start";

const attendanceStatusSurface: Record<
  FingerprintAttendanceStatus,
  string
> = {
  in: "bg-brand-50 text-brand-800",
  out: "bg-neutral-100 text-neutral-700",
  in_out: "bg-jade-50 text-jade-800",
};

export function AdminFingerprintImportPage(): ReactElement {
  const t = useTranslations("admin.fingerprintImportPage");
  const locale = useLocale();
  const now = new Date();

  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [monthData, setMonthData] = useState<FingerprintImportMonthData | null>(null);
  const [recordsSearchQuery, setRecordsSearchQuery] = useState("");
  const [recordsPage, setRecordsPage] = useState(1);

  useSyncExternalStore(
    subscribeFingerprintImports,
    getFingerprintImportsVersionSnapshot,
    () => 0
  );

  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  const yearOptions = useMemo(
    () =>
      buildYearOptions(now.getFullYear()).map((value) => ({
        value: String(value),
        label: String(value),
      })),
    [now]
  );

  const monthOptions = useMemo(
    () =>
      buildMonthOptions().map((value) => ({
        value: String(value),
        label: t(`months.${value}` as "months.1"),
      })),
    [t]
  );

  const loadMonthData = useCallback(async (): Promise<void> => {
    if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth)) return;

    setLoadingMonth(true);
    setFetchError(null);

    const response = await fetchFingerprintImportMonth(parsedYear, parsedMonth);

    if (response.ok) {
      setMonthData(response.data);
    } else {
      setFetchError(response.message);
      setMonthData(getFingerprintImportMonthSnapshot(parsedYear, parsedMonth));
    }

    setLoadingMonth(false);
  }, [parsedMonth, parsedYear]);

  useEffect(() => {
    hydrateFingerprintImports();
  }, []);

  useEffect(() => {
    void loadMonthData();
  }, [loadMonthData]);

  useEffect(() => {
    setRecordsSearchQuery("");
    setRecordsPage(1);
  }, [parsedYear, parsedMonth]);

  useEffect(() => {
    if (monthData) return;
    setMonthData(getFingerprintImportMonthSnapshot(parsedYear, parsedMonth));
  }, [monthData, parsedMonth, parsedYear]);

  const uploads = monthData?.uploads ?? [];
  const records = monthData?.records ?? [];
  const allMonths = getAllFingerprintImportMonthsSnapshot();

  const filteredRecords = useMemo(
    () => searchFingerprintRecords(records, recordsSearchQuery),
    [records, recordsSearchQuery]
  );

  const recordsTotalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / RECORDS_PAGE_SIZE)
  );
  const safeRecordsPage = Math.min(recordsPage, recordsTotalPages);

  const pagedRecords = useMemo(() => {
    const start = (safeRecordsPage - 1) * RECORDS_PAGE_SIZE;
    return filteredRecords.slice(start, start + RECORDS_PAGE_SIZE);
  }, [filteredRecords, safeRecordsPage]);

  const recordsEmptyMessage =
    records.length === 0 ? t("recordsEmpty") : t("recordsNoResults");

  const handleRecordsSearchChange = (value: string): void => {
    setRecordsSearchQuery(value);
    setRecordsPage(1);
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      setUploadError(t("errors.noFile"));
      return;
    }

    setUploading(true);
    setUploadError(null);

    const response = await submitFingerprintImport({
      file: selectedFile,
      year: parsedYear,
      month: parsedMonth,
    });

    if (response.ok) {
      setMonthData(response.data);
      setSelectedFile(undefined);
    } else {
      setUploadError(response.message);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5 shadow-xs sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
            <Fingerprint className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">{t("uploadSectionTitle")}</h2>
            <p className="text-sm text-text-secondary">{t("uploadSectionSubtitle")}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <MainSelect
            label={t("fields.year")}
            value={year}
            onValueChange={setYear}
            options={yearOptions}
            startIcon={<Calendar className="size-4" />}
          />
          <MainSelect
            label={t("fields.month")}
            value={month}
            onValueChange={setMonth}
            options={monthOptions}
            startIcon={<Calendar className="size-4" />}
          />
        </div>

        <div className="mt-5">
          <CustomUpload
            label={t("fields.file")}
            hint={t("fields.fileHint")}
            dropLabel={t("upload.dropLabel")}
            browseLabel={t("upload.browseLabel")}
            supportedFormatsLabel={t("upload.supportedFormats")}
            removeLabel={t("upload.removeFile")}
            value={selectedFile}
            onChange={(file) => {
              setSelectedFile(file);
              setUploadError(null);
            }}
            error={uploadError ?? undefined}
            disabled={uploading || loadingMonth}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <MainButton
            variant="primary"
            startIcon={<UploadCloud className="size-4" />}
            loading={uploading}
            disabled={!selectedFile || uploading || loadingMonth}
            onClick={() => {
              void handleUpload();
            }}
          >
            {t("upload.submit")}
          </MainButton>
          {loadingMonth ? (
            <p className="text-sm text-text-muted">{t("loadingMonth")}</p>
          ) : null}
        </div>

        {fetchError ? (
          <p className="mt-3 text-sm text-danger-600" role="alert">
            {fetchError}
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="size-4 text-text-muted" aria-hidden />
          <h2 className="text-sm font-semibold text-ink">
            {t("historyTitle", { count: uploads.length })}
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("historyColumns.fileName")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("historyColumns.period")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("historyColumns.uploadedAt")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("historyColumns.uploadedBy")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("historyColumns.recordCount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {uploads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">
                      {t("historyEmpty")}
                    </td>
                  </tr>
                ) : (
                  uploads.map((upload) => (
                    <tr
                      key={upload.id}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        upload.year === parsedYear &&
                          upload.month === parsedMonth &&
                          "bg-primary-50/40"
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-ink">{upload.fileName}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {t(`months.${upload.month}` as "months.1")} {upload.year}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatDateTime12(
                          new Date(upload.uploadedAt),
                          resolveTimeLocale(locale)
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{upload.uploadedBy}</td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">
                        {upload.recordCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {allMonths.length > 0 ? (
        <section className="rounded-lg border border-border bg-surface-muted/30 px-4 py-3">
          <p className="text-xs font-medium text-text-secondary">{t("otherMonthsHint")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {allMonths.map((item) => (
              <MainButton
                key={`${item.year}-${item.month}`}
                variant={
                  item.year === parsedYear && item.month === parsedMonth
                    ? "primary"
                    : "secondary"
                }
                size="sm"
                onClick={() => {
                  setYear(String(item.year));
                  setMonth(String(item.month));
                }}
              >
                {t(`months.${item.month}` as "months.1")} {item.year}
              </MainButton>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-ink">
            {t("recordsTitle", {
              count: filteredRecords.length,
              month: t(`months.${parsedMonth}` as "months.1"),
              year: parsedYear,
            })}
          </p>
          <div className="w-full sm:max-w-xs">
            <MainInput
              type="search"
              value={recordsSearchQuery}
              onChange={(event) => handleRecordsSearchChange(event.target.value)}
              placeholder={t("recordsSearchPlaceholder")}
              startIcon={<Search />}
              aria-label={t("recordsSearchPlaceholder")}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                {Array.from({ length: RECORDS_COLUMN_COUNT }, (_, index) => (
                  <col key={index} className={recordsTableColClass} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.name")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.phoneNumber")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.fingerprintId")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.fingerprintSerial")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.clockIn")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.clockOut")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.date")}
                  </th>
                  <th className={recordsTableHeaderClass}>
                    {t("recordsColumns.attendanceStatus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={RECORDS_COLUMN_COUNT} className="px-4 py-10 text-center text-sm text-text-muted">
                      {recordsEmptyMessage}
                    </td>
                  </tr>
                ) : (
                  pagedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border last:border-b-0">
                      <td className={cn(recordsTableCellClass, "font-medium text-ink")} title={record.name ?? undefined}>
                        {record.name ?? t("recordsUnknownEmployee")}
                      </td>
                      <td className={cn(recordsTableCellClass, "tabular-nums text-text-secondary")} title={record.phoneNumber ?? undefined}>
                        {record.phoneNumber ?? "—"}
                      </td>
                      <td className={cn(recordsTableCellClass, "tabular-nums text-text-secondary")} title={record.fingerprintId}>
                        {record.fingerprintId}
                      </td>
                      <td className={cn(recordsTableCellClass, "tabular-nums text-text-secondary")} title={record.fingerprintSerial ?? undefined}>
                        {record.fingerprintSerial ?? "—"}
                      </td>
                      <td className={cn(recordsTableCellClass, "tabular-nums text-text-secondary")}>
                        {formatStoredTime12(record.clockIn, resolveTimeLocale(locale))}
                      </td>
                      <td className={cn(recordsTableCellClass, "tabular-nums text-text-secondary")}>
                        {formatStoredTime12(record.clockOut, resolveTimeLocale(locale))}
                      </td>
                      <td className={cn(recordsTableCellClass, "text-text-secondary")} title={record.date}>
                        {formatStoredDate(record.date, resolveTimeLocale(locale))}
                      </td>
                      <td className={recordsTableCellClass}>
                        <span
                          className={cn(
                            "inline-flex max-w-full truncate rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            attendanceStatusSurface[record.attendanceStatus]
                          )}
                        >
                          {t(`attendanceStatus.${record.attendanceStatus}`)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            page={safeRecordsPage}
            pageSize={RECORDS_PAGE_SIZE}
            totalItems={filteredRecords.length}
            onPageChange={setRecordsPage}
            previousLabel={t("pagination.previous")}
            nextLabel={t("pagination.next")}
            formatSummary={({ start, end, total }) =>
              t("pagination.summary", { start, end, total })
            }
          />
        </div>
      </section>
    </div>
  );
}
