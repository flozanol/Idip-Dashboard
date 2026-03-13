import { getDashboardData } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import ReportClient from "./ReportClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getDashboardData();
  
  return <ReportClient data={data} />;
}
