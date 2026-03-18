"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";
import fetcher from "@/app/lib/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/custom/components/Sidebar";
import CreateGroupModal from "@/app/custom/components/CreateGroupModal";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/login" || pathname === "/signup";
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const swrOptions = {
    fetcher,
    revalidateOnFocus: true,
    refreshInterval: 60000,
    dedupingInterval: 2000,
  };

  if (isPublicPage) return <main>{children}</main>;

  return (
    <SWRConfig value={swrOptions}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar onOpenModal={() => setIsCreateGroupOpen(true)} />
          <main className="flex-1">{children}</main>
          <CreateGroupModal 
            isOpen={isCreateGroupOpen} 
            onClose={() => setIsCreateGroupOpen(false)} 
          />
        </div>
      </SidebarProvider>
    </SWRConfig>
  );
}