import { Header } from "@/components/layout/header";
import { SidebarMain } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden bg-[#FAFAFA] font-sans text-trampo-dark antialiased">
      {/* Sidebar Component */}
      <SidebarMain />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Component */}
        <Header />

        {/* Dynamic page contents scroll wrapper */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA] relative">
          {/* Soft, large-scale turquoise/green radial gradient glows in background */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#DDF6F0]/65 to-transparent blur-[100px] pointer-events-none z-0" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#F2FCFA]/80 to-transparent blur-[80px] pointer-events-none z-0" />

          {/* Children content wrapper */}
          <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
