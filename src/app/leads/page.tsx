import { getDashboardData } from "@/lib/actions";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage() {
  const data = await getDashboardData();
  return <LeadsClient data={data} />;
}
