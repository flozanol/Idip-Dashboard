import { getDashboardData } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import ClientDashboardWrapper from "./ClientDashboardWrapper";

export default async function Page() {
  const data = await getDashboardData();
  const session = await getSession();
  
  return <ClientDashboardWrapper data={{ ...data, currentUser: session?.user }} />;
}
