import { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SparklesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — Abutu",
  description: "Sign in to your Abutu account to manage venues, workspaces, and reservations.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <SparklesIcon className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">Abutu</span>
        </Link>
      </div>
      {children}
      <p className="mt-8 text-sm text-muted-foreground">
        AI-Powered Venue & Workspace Reservations
      </p>
    </div>
  );
}
