import { getDashboardData } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import PerformanceClient from "./PerformanceClient";

export default async function Page() {
  const data = await getDashboardData();
  const session = await getSession();
  
  return <PerformanceClient data={{ ...data, currentUser: session?.user }} />;
}
