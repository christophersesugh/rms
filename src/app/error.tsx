"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6 glass-card p-8">
        <AlertTriangleIcon className="h-16 w-16 text-destructive mx-auto" />
        <div>
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-muted-foreground mt-2">
            We encountered an unexpected error. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}