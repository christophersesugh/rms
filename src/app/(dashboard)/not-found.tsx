import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestionIcon, HomeIcon } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 glass-card p-8">
        <FileQuestionIcon className="h-16 w-16 text-muted-foreground mx-auto opacity-40" />
        <div>
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-muted-foreground mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link href="/dashboard">
          <Button>
            <HomeIcon className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
