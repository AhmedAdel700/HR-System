import { EditRequest } from "@/components/employee/EditRequest";

export default async function EditRequestRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditRequest id={id} />;
}
