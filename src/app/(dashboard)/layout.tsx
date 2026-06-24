import { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/sidebar-nav";
import { ChatWidget } from "@/components/chat-widget";

export const metadata: Metadata = {
  title: "Dashboard — ReserveSync",
  description: "Manage your venues, workspaces, and reservations from your dashboard.",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "admin";
  const userEmail = session.user.email ?? "";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 glass border-b border-border">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 glass-card border-none">
            <div className="p-6 font-bold text-xl tracking-tight text-primary">
              Abutu
            </div>
            <SidebarNav userEmail={userEmail} isAdmin={isAdmin} />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="font-bold text-lg tracking-tight text-primary">
          Abutu
        </Link>
        <div className="w-10" />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 glass border-r border-border md:min-h-screen flex-col">
        <div className="p-6 font-bold text-xl tracking-tight text-primary">
          Abutu
        </div>
        <SidebarNav userEmail={userEmail} isAdmin={isAdmin} />
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}
