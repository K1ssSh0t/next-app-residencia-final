import {
  ChevronUpIcon,
  HomeIcon,
  SettingsIcon,
  User2Icon,
  LogOutIcon,
  Table2Icon,
  GaugeIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "@/schema/users";
import Link from "next/link";

const items = [
  { title: "Home", url: "/", icon: HomeIcon },
  { title: "Admin", url: "/admin", icon: GaugeIcon },
  { title: "Users", url: "/admin/users", icon: Table2Icon },
  { title: "Carreras", url: "/admin/carreras", icon: Table2Icon },
  { title: "Categoria Personas", url: "/admin/categoria-personas", icon: Table2Icon },
  { title: "Tipo Bachilleres", url: "/admin/tipo-bachilleres", icon: Table2Icon },
  { title: "Tipo Instituciones", url: "/admin/tipo-instituciones", icon: Table2Icon },
// [CODE_MARK admin-sidebar-items]
];

export function AdminSidebar({ user }: { user: User }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Avatar className="w-6 h-6">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  <User2Icon />
                </AvatarFallback>
              </Avatar>
              {user.name}
              <ChevronUpIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <Link href="/admin/settings">
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </Link>
            <Link href="/signout">
              <DropdownMenuItem>
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}