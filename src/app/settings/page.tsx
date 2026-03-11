import { getDashboardData } from "@/lib/actions";
import SettingsPage from "./SettingsPage";

export default async function Page() {
  const { cursos, vendedores } = await getDashboardData();
  
  return <SettingsPage cursos={cursos} vendedores={vendedores} />;
}
