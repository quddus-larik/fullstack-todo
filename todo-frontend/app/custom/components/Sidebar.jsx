"use client"
import { useEffect, useState } from "react"
import { LayoutDashboard, Plus, Hash, LogOut, Loader2, ChevronRight, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, 
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter 
} from "@/components/ui/sidebar"
import { useGroups } from "@/hooks/useData"
import api from "../../lib/api"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { fetcher } from "../../lib/api"

export function AppSidebar({ onOpenModal }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeGroupId = searchParams.get('group')
  const { groups, isLoading } = useGroups()

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }
  const { data: user } = useSWR('/me/', fetcher)
  console.log(user)

  const navigateToGroup = (id) => {
    if (id) {
      router.push(`/dashboard?group=${id}`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <Sidebar 
      variant="floating" 
      collapsible="icon"
      className="border-r border-gray-200/50 bg-gradient-to-b from-white to-gray-50/50"
    >
      <SidebarContent className="gap-6 py-4">
        {/* SECTION 1: PERSONAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Application
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2">
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigateToGroup(null)}
                isActive={!activeGroupId}
                className={cn(
                  "group relative overflow-hidden transition-all duration-200",
                  "hover:bg-indigo-50 hover:text-indigo-700",
                  "data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700 data-[active=true]:font-medium",
                  "rounded-xl mx-2"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors duration-200",
                    !activeGroupId ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                  )}>
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="text-sm">My Private Tasks</span>
                </div>
                {!activeGroupId && (
                  <ChevronRight size={16} className="absolute right-3 text-indigo-400" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* SECTION 2: WORKSPACES */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 mb-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Workspaces
            </SidebarGroupLabel>
            <span className="text-xs text-gray-400">
              {groups?.length || 0} total
            </span>
          </div>

          {/* Create Workspace Button - Enhanced */}
          <div className="px-2 mb-3">
            <button
              onClick={onOpenModal}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5",
                "bg-gradient-to-r from-indigo-600 to-indigo-500",
                "hover:from-indigo-700 hover:to-indigo-600",
                "text-white font-medium rounded-xl",
                "shadow-lg shadow-indigo-200/50",
                "transition-all duration-200",
                "active:scale-[0.98]",
                "group relative overflow-hidden"
              )}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Plus size={18} className="flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Create Workspace</span>
              <ChevronRight size={16} className="opacity-70" />
            </button>
          </div>

          {/* Workspaces List */}
          <SidebarMenu className="space-y-0.5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="relative">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  <div className="absolute inset-0 blur-xl bg-indigo-200/50 animate-pulse" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Loading workspaces...</p>
              </div>
            ) : groups?.length > 0 ? (
              groups?.map((group, index) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton 
                    onClick={() => navigateToGroup(group.id)}
                    isActive={activeGroupId === String(group.id)}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-200",
                      "hover:bg-indigo-50 hover:text-indigo-700",
                      "data-[active=true]:bg-indigo-100 data-[active=true]:text-indigo-700 data-[active=true]:font-medium",
                      "rounded-xl mx-2",
                      "animate-in fade-in slide-in-from-left-2",
                      { "delay-75": index === 0 },
                      { "delay-100": index === 1 },
                      { "delay-150": index >= 2 }
                    )}
                    style={{ animationDuration: '300ms' }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors duration-200 flex-shrink-0",
                        activeGroupId === String(group.id) 
                          ? "bg-indigo-100 text-indigo-600" 
                          : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      )}>
                        <Hash size={16} />
                      </div>
                      <span className="text-sm truncate flex-1">{group.name}</span>
                      {activeGroupId === String(group.id) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="p-3 bg-gray-100 rounded-full mb-2">
                  <Users size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No workspaces yet</p>
                <p className="text-xs text-gray-400 mt-1">Create your first workspace</p>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className={cn(
                "group relative overflow-hidden transition-all duration-200",
                "hover:bg-red-50 hover:text-red-600",
                "rounded-xl",
                "data-[active=true]:bg-red-100 data-[active=true]:text-red-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-red-100 text-red-500 group-hover:bg-red-200 transition-colors duration-200">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </div>
              <div className="absolute inset-0 bg-red-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* User Info (Optional) */}
        <div className="mt-2 px-3 py-2 text-xs text-gray-400 border-t border-gray-100">
          <p className="truncate">Signed in as {user?.username}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}