"use client"

import { useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"
import { useGroups } from "@/hooks/useData"

import {
  LayoutDashboard,
  Plus,
  Hash,
  Loader2,
  Users,
  LogOut,
  User,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { fetcher } from "../../lib/api"

export function AppSidebar({ onOpenModal }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeGroupId = searchParams.get("group")

  const { groups, isLoading } = useGroups()
  const { data: user } = useSWR("/me/", fetcher)

  const navigateToGroup = (id) => {
    if (id) router.push(`/dashboard?group=${id}`)
    else router.push("/dashboard")
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  const initials =
    user?.username
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <Sidebar collapsible="icon" variant="sidebar">

      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b">

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            T
          </div>

          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            Tasks
          </span>
        </div>

        <SidebarTrigger />

      </div>

      <SidebarContent className="gap-6 py-4">

        {/* APPLICATION */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Application
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>

              <SidebarMenuButton
                onClick={() => navigateToGroup(null)}
                isActive={!activeGroupId}
                className="group-data-[collapsible=icon]:justify-center"
              >
                <LayoutDashboard size={18} />

                <span className="group-data-[collapsible=icon]:hidden">
                  Dashboard
                </span>

              </SidebarMenuButton>

            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* WORKSPACES */}
        <SidebarGroup>

          <SidebarGroupLabel>
            Workspaces
          </SidebarGroupLabel>

          {/* CREATE GROUP */}

          <div className="px-2 mb-3">

            <button
              onClick={onOpenModal}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition group-data-[collapsible=icon]:justify-center"
            >
              <Plus size={18} />

              <span className="group-data-[collapsible=icon]:hidden">
                Create Workspace
              </span>

            </button>

          </div>

          {/* GROUP LIST */}

          <SidebarMenu>

            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-indigo-600" />
              </div>
            ) : groups?.length > 0 ? (

              groups.map((group) => (

                <SidebarMenuItem key={group.id}>

                  <SidebarMenuButton
                    onClick={() => navigateToGroup(group.id)}
                    isActive={activeGroupId === String(group.id)}
                    className="group-data-[collapsible=icon]:justify-center"
                  >

                    <Hash size={16} />

                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {group.name}
                    </span>

                  </SidebarMenuButton>

                </SidebarMenuItem>

              ))

            ) : (

              <div className="text-center py-6 text-gray-400">
                <Users className="mx-auto mb-2" size={20} />

                <p className="text-sm group-data-[collapsible=icon]:hidden">
                  No workspaces
                </p>
              </div>

            )}

          </SidebarMenu>

        </SidebarGroup>

      </SidebarContent>

      {/* ACCOUNT SECTION */}

      <SidebarFooter className="border-t p-3">

        {user && (

          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition">

                <Avatar className="h-8 w-8">

                  <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>

                </Avatar>

                <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">

                  <span className="text-sm font-medium">
                    {user.username}
                  </span>

                  <span className="text-xs text-gray-500">
                    Account
                  </span>

                </div>

              </button>

            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="top"
              className="w-52"
            >

              <DropdownMenuItem className="gap-2">
                <User size={16} />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2">
                <Settings size={16} />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-red-600"
              >
                <LogOut size={16} />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        )}

      </SidebarFooter>

    </Sidebar>
  )
}