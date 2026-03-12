import { getDashboardData } from "@/lib/actions";
import { initDb } from "@/lib/db";
import { MobileHeader } from "@/components/MobileHeader";
import ClientDashboardWrapper from "./ClientDashboardWrapper";

export default async function Dashboard() {
  await initDb();
  const data = await getDashboardData();

  return <ClientDashboardWrapper data={data} />;
}
