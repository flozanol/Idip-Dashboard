import { getDashboardData } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage() {
  const data = await getDashboardData();
  const session = await getSession();
  return <LeadsClient data={{ ...data, currentUser: session?.user }} />;
}
