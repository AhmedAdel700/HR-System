import { NewRequestByType } from "./NewRequestByType";

export default async function NewRequestByTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <NewRequestByType type={type} />;
}
