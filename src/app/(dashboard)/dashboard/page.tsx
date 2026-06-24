import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, LaptopIcon, SparklesIcon, ArrowRightIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) return null;

  const [upcomingReservations, totalReservations] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        userId: parseInt(session.user.id!),
        reservationDate: { gte: new Date() },
        status: { not: "Cancelled" },
      },
      include: { venue: true, workspace: true },
      orderBy: { reservationDate: "asc" },
      take: 5,
    }),
    prisma.reservation.count({
      where: {
        userId: parseInt(session.user.id!),
        status: { not: "Cancelled" },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your reservations and activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingReservations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active reservations</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time reservations</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
            <SparklesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Chat with AI to book</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/venues" className="group">
          <Card className="glass hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Browse Venues</h3>
                  <p className="text-sm text-muted-foreground">Find event spaces for your next meeting</p>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/workspaces" className="group">
          <Card className="glass hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <LaptopIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Find Workspaces</h3>
                  <p className="text-sm text-muted-foreground">Book a desk or private office</p>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Your Next Events</h2>
          {upcomingReservations.length > 0 && (
            <Link href="/reservations">
              <Button variant="ghost" size="sm">
                View all <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        {upcomingReservations.length === 0 ? (
          <Card className="glass border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <CalendarIcon className="h-10 w-10 mb-3 opacity-20" />
              <p className="font-medium">No upcoming reservations</p>
              <p className="text-sm mt-1">Browse venues or workspaces to make a booking</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingReservations.map((res) => {
              const resource = res.venue ?? res.workspace;
              const isVenue = !!res.venue;
              return (
                <Card key={res.id} className="glass">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {resource?.name}
                      </CardTitle>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        RES-{res.id}
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {new Date(res.reservationDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {isVenue ? (
                        <MapPinIcon className="mr-2 h-4 w-4 shrink-0" />
                      ) : (
                        <LaptopIcon className="mr-2 h-4 w-4 shrink-0" />
                      )}
                      {isVenue ? res.venue!.location : (res.workspace as { type: string }).type}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
