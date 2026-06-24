"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2Icon, CheckIcon, AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullname?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          setErrors(data.errors);
        } else if (res.status === 409) {
          setErrors({ email: data.message });
        } else {
          setErrors({ form: data.message || "Failed to create account" });
        }
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Card className="w-full max-w-md glass-card border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>
          Get started with Abutu in seconds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              {errors.form}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => { setFullname(e.target.value); clearError("fullname"); }}
              required
              disabled={isLoading}
              autoComplete="name"
              className={`h-11 ${errors.fullname ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.fullname && (
              <p className="text-sm text-red-500">{errors.fullname}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              required
              disabled={isLoading}
              autoComplete="email"
              className={`h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className={`h-11 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            {password.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                <CheckIcon className={`h-3 w-3 ${passwordChecks[0].met ? "text-emerald-500" : "text-muted-foreground/50"}`} />
                <span className={passwordChecks[0].met ? "text-emerald-500" : ""}>{passwordChecks[0].label}</span>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 mt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
