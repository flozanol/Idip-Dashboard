import { getDashboardData } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import SettingsPage from "./SettingsPage";

export default async function Page() {
  const { cursos, vendedores, sedes, objetivos } = await getDashboardData();
  const session = await getSession();
  
  return <SettingsPage 
    cursos={cursos} 
    vendedores={vendedores} 
    sedes={sedes}
    objetivos={objetivos}
    currentUser={session?.user} 
  />;
}
