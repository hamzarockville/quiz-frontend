"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, Calendar, Search, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";

const defaultItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Create Test", url: "/dashboard/create-test", icon: Inbox },
  { title: "Settings", url: "/dashboard/settings", icon: Inbox },
  { title: "Billing Settings", url: "/dashboard/billing", icon: Inbox },
  { title: "View Results", url: "/dashboard/candidate-tests", icon: Calendar },
  { title: "Show All Tests", url: "/dashboard/all-tests", icon: Search },
];

const adminItems = [
  { title: "Manage Subscriptions", url: "/dashboard/admin/manage-subscription", icon: Inbox },
  { title: "View Users", url: "/dashboard/admin/view-users", icon: Search },
];

const teamAdminItems = [
  { title: "Add Users", url: "/dashboard/team-admin/add-users", icon: Settings },
  { title: "View Team Members", url: "/dashboard/team-admin/view-team-members", icon: Settings },
];

const hiddenForAdmin = [
  "Create Test",
  "Add Users",
  "View Team Members",
  "Show All Tests",
  "View Results",
];

export default function CustomSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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

    if (user.role === "admin") {
      const filteredItems = defaultItems.filter(
        (item) => !hiddenForAdmin.includes(item.title)
      );
      setMenuItems([...filteredItems, ...adminItems]);
    } else if (isTeamAdmin) {
      setMenuItems([...defaultItems, ...teamAdminItems]);
    } else {
      setMenuItems(defaultItems);
    }
  }, [isTeamAdmin]);

  return (
    <div className="flex">
      <div
        className={cn(
          "fixed z-40 h-screen bg-gray-600 text-white transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:w-48"
        )}
      >
        {/* <div className="p-4">
          <h1 className="text-lg font-bold">My Sidebar</h1>
        </div> */}
        <nav className="space-y-2 p-4">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.url}>
              <p
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-blue-700",
                  pathname === item.url ? "bg-blue-700" : ""
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.title}</span>
              </p>
            </Link>
          ))}
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-10 flex items-center bg-white p-4 shadow-md md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold">My App</h1>
        </header>
        <main className="p-4"></main>
      </div>
    </div>
  );
}

