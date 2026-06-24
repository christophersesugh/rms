import Link from "next/link";
import { BuildingIcon, LaptopIcon, BotIcon, CalendarCheckIcon, ArrowRightIcon, SparklesIcon, ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Event Venues",
    description: "Browse and book fully-equipped event spaces for conferences, meetings, and special occasions.",
    icon: BuildingIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Workspaces",
    description: "Find the perfect spot to focus — from hot desks to private offices and meeting rooms.",
    icon: LaptopIcon,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    title: "AI Assistant",
    description: "Let our AI agent help you find availability, make bookings, and manage reservations conversationally.",
    icon: BotIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Smart Scheduling",
    description: "View upcoming reservations at a glance, manage bookings, and prevent double-booking automatically.",
    icon: CalendarCheckIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const steps = [
  {
    step: "01",
    title: "Browse Spaces",
    description: "Explore available venues and workspaces with detailed descriptions, capacity info, and pricing.",
  },
  {
    step: "02",
    title: "Book Instantly",
    description: "Select your preferred date and confirm your reservation in seconds — or ask the AI assistant.",
  },
  {
    step: "03",
    title: "Manage Easily",
    description: "View, modify, or cancel bookings from your dashboard. Stay organized with clear status tracking.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <SparklesIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">ReserveSync</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <SparklesIcon className="h-3.5 w-3.5" />
              AI-Powered Reservation System
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Reserve spaces{" "}
              <span className="text-primary">smarter</span>
              ,{" "}
              <br className="hidden sm:block" />
              not harder.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ReserveSync is an intelligent venue and workspace reservation platform.
              Browse spaces, book instantly, and let AI handle the logistics —
              so you can focus on what matters.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 gap-2">
                  Get Started Free <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Everything you need to manage reservations
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A complete platform for booking event venues and workspaces, powered by AI.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="glass-card border-none group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`p-3 rounded-xl ${feature.bg} w-fit mb-2`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to your next booking.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                <div className="text-6xl font-bold text-primary/10 absolute -top-4 -left-2 select-none">
                  {step.step}
                </div>
                <div className="relative pt-8 pl-2">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <Card className="glass-card border-none p-8 md:p-12 text-center">
            <div className="max-w-xl mx-auto">
              <ShieldIcon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ready to get started?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Create your free account and start booking spaces in minutes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto px-8 gap-2">
                    Create Account <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">ReserveSync</span>
          </div>
          <p>&copy; {new Date().getFullYear()} ReserveSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
