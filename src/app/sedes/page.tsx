import { getDashboardData } from "@/lib/actions";
import SedesClient from "./SedesClient";

export default async function SedesPage() {
  const data = await getDashboardData();
  return <SedesClient data={data} />;
}
