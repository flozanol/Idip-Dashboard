import { getDashboardData } from "@/lib/actions";
import PerformanceClient from "./PerformanceClient";

export default async function PerformancePage() {
  const data = await getDashboardData();
  return <PerformanceClient data={data} />;
}
