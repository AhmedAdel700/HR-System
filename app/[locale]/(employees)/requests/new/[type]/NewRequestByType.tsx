import { notFound } from "next/navigation";
import { RequestForm } from "@/components/employee/RequestForm";
import { isRequestType } from "@/lib/employee/demo-data";

export function NewRequestByType({ type }: { type: string }) {
  if (!isRequestType(type)) notFound();
  return <RequestForm type={type} />;
}
