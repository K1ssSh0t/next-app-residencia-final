import {
  ChevronUpIcon,
  HomeIcon,
  User2Icon,
  LogOutIcon,
  Table2Icon,
  LayoutDashboardIcon,
  ArrowLeftIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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
import GoBackButton from "../go-back-button";
import { ModeToggle } from "../mode-toggle";

const items = [
  { title: "Home", url: "/", icon: HomeIcon },
  { title: "Dashboard", "url": "/dashboard", icon: LayoutDashboardIcon },
  { title: "Instituciones", url: "/instituciones", icon: Table2Icon },
  { title: "Cuestionarios", url: "/cuestionarios", icon: Table2Icon },
  // { title: "Preguntas", url: "/preguntas", icon: Table2Icon },
  // [CODE_MARK private-sidebar-items]
];

export function PrivateSidebar({ user }: { user: User }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className=" flex justify-between m-2">
              <GoBackButton />
              <ModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
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
            <Link href="/profile">
              <DropdownMenuItem>
                <User2Icon />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/signout">
              <DropdownMenuItem>
                <LogOutIcon />
                Cerrar Sesion
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
