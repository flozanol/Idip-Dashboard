import { getDashboardData } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import SedesClient from "./SedesClient";

export default async function Page() {
  const data = await getDashboardData();
  const session = await getSession();
  
  return <SedesClient data={{ ...data, currentUser: session?.user }} />;
}
