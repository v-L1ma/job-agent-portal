import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PreferenciasForm } from "@/components/preferencias/preferencias-form";

export default function PreferencesPage() {
  return (
    <DashboardLayout title="Preferências de Busca">
      <PreferenciasForm />
    </DashboardLayout>
  );
}
