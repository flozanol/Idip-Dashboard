import { getDashboardData } from "@/lib/actions";
import LeadsPage from "./LeadsPage";

export default async function Page() {
  const data = await getDashboardData();
  return <LeadsPage data={data} />;
}
