import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Plataforma",
      url: "#",
      items: [
        {
          title: "Minha agenda",
          url: "minha-agenda",
        },
        // {
        //   title: "Agendar para cliente",
        //   url: "agendar",
        // },
      ],
    },
  ],
};

export function AppSidebarBarber({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  const checkIsActive = (url: string) => {
    if (url === "#") return false;

    const currentPath = location.pathname.replace(/^\//, "").split("/")[1];

    return currentPath === url;
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="flex items-center justify-center size-8 rounded-lg">
                  <img
                    src="/logo-barb.png"
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">LS Barbearia - Gerente</span>
                  <span>{user?.name}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((group) => (
              <SidebarMenuItem key={group.title}>
                <SidebarMenuButton asChild className="hover:bg-transparent hover:text-muted-foreground">
                  <span className="font-medium text-muted-foreground">
                    {group.title}
                  </span>
                </SidebarMenuButton>
                {group.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {group.items.map((item) => {
                      const isActive = checkIsActive(item.url);

                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            onClick={() => navigate(item.url)}
                            className="cursor-pointer"
                          >
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
