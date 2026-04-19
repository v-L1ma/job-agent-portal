import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CurriculoForm } from "@/components/curriculo/curriculo-form";

export default function CurriculumPage() {
  return (
    <DashboardLayout title="Gerenciar Currículo">
      <CurriculoForm />
    </DashboardLayout>
  );
}
