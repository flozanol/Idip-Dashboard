import { getDashboardData } from "@/lib/actions";
import InvestmentsPage from "./InvestmentsPage";

export default async function Page() {
  const { inversiones } = await getDashboardData();
  
  return <InvestmentsPage inversiones={inversiones} />;
}
