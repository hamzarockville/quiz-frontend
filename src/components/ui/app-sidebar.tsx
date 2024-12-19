"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { apiRequest } from "@/lib/api";
import { SubscriptionPlan } from "@/app/dashboard/create-test/page";

// Menu items.
const defaultItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Create Test",
    url: "/dashboard/create-test",
    icon: Inbox,
  },
  {
    title: "View Results",
    url: "/dashboard/candidate-tests",
    icon: Calendar,
  },
  {
    title: "Show All Tests",
    url: "/dashboard/all-tests",
    icon: Search,
  },
  // {
  //   title: "Settings",
  //   url: "/dashboard/settings",
  //   icon: Settings,
  // },
 
];

// Admin-specific menu items.
const adminItems = [
  {
    title: "Manage Subscriptions",
    url: "/dashboard/admin/manage-subscription",
    icon: Inbox,
  },
  {
    title: "View Users",
    url: "/dashboard/admin/view-users",
    icon: Search,
  },
];

const TeamAdminItems = [
  {
    title: "Add Users",
    url: "/dashboard/team-admin/add-users",
    icon: Settings,
  },
  {
    title: "View Team Members",
    url: "/dashboard/team-admin/view-team-members",
    icon: Settings,
  },
];
const hiddenForAdmin = ["Create Test", "Add Users", "View Team Members", "Show All Tests", "View Results"];
export function AppSidebar() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState(defaultItems);
  const [isTeamAdmin, setIsTeamAdmin] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);

    const fetchSubscriptionData = async () => {
      try {
        const subscriptionStatus = await apiRequest<{ isTeamAdmin: boolean }>(
          `/user/subscription-details/${user.userId}`
        );
        setIsTeamAdmin(subscriptionStatus.isTeamAdmin);

      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();

    if (storedUser) {
      const user = JSON.parse(storedUser);

      // Check if the user has the admin role
      if (user.role === "admin") {
        // Filter out hidden items and merge with admin-specific items
        const filteredItems = defaultItems.filter(
          (item) => !hiddenForAdmin.includes(item.title)
        );
        setMenuItems([...filteredItems, ...adminItems]);
      } else if (isTeamAdmin) {
        // Filter out hidden items and merge with admin-specific items
     
        setMenuItems([...defaultItems, ...TeamAdminItems]);
      }
    }
  }, [isTeamAdmin]);


  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold px-4 py-2">
            Quiz
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
                      pathname === item.url
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Link href={item.url} className="flex items-center w-full">
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
