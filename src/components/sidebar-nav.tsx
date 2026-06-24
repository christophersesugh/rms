"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  MapPinIcon,
  LaptopIcon,
  CalendarCheckIcon,
  ShieldIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/actions/signout";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/venues", label: "Venues", icon: MapPinIcon },
  { href: "/workspaces", label: "Workspaces", icon: LaptopIcon },
  { href: "/reservations", label: "My Reservations", icon: CalendarCheckIcon },
];

type SidebarNavProps = {
  userEmail: string;
  isAdmin: boolean;
};

export function SidebarNav({ userEmail, isAdmin }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-border">
            <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Admin
            </div>
            <Button
              variant={pathname === "/admin" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin" aria-current={pathname === "/admin" ? "page" : undefined}>
                <ShieldIcon className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
            <Button
              variant={pathname === "/admin/users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/admin/users" aria-current={pathname === "/admin/users" ? "page" : undefined}>
                <UsersIcon className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
          </div>
        )}
      </nav>

      <div className="px-4 py-2 flex items-center justify-between">
        <ThemeToggle />
      </div>

      <div className="p-4 border-t border-border">
        <div className="mb-2 px-2 text-sm text-muted-foreground truncate" title={userEmail}>
          {userEmail}
        </div>
        <form action={signOutAction}>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOutIcon className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </form>
      </div>
    </>
  );
}
