"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsersIcon, LaptopIcon, SearchIcon, CalendarCheckIcon } from "lucide-react";
import { NairaIcon } from "@/components/ui/naira-icon";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

type Workspace = {
  id: number;
  name: string;
  type: string;
  description?: string;
  capacity: number;
  price: number;
};

const timeOptions = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const formatTimeOption = (t: string) => {
  const [hour, minute] = t.split(":");
  const h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${minute} ${ampm}`;
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [rangeMode, setRangeMode] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [rangeSummary, setRangeSummary] = useState<{ total: number; booked: number; available: number } | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    const abortController = new AbortController();
    fetch("/api/workspaces", { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setWorkspaces(data))
      .catch(() => toast.error("Failed to load workspaces"))
      .finally(() => setIsLoading(false));
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!selectedWorkspace) return;
    const controller = new AbortController();
    const month = calendarMonth.getMonth();
    const year = calendarMonth.getFullYear();
    fetch(`/api/reservations/availability?workspaceId=${selectedWorkspace.id}&month=${month}&year=${year}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setBookedDates(new Set<string>((data.bookedDates ?? []) as string[])))
      .catch(() => {});
    return () => controller.abort();
  }, [selectedWorkspace, calendarMonth]);

  // Fetch range availability when date range changes
  useEffect(() => {
    if (!selectedWorkspace || !rangeMode || !dateRange.from || !dateRange.to) {
      setRangeSummary(null);
      return;
    }
    const controller = new AbortController();
    const from = dateRange.from.toISOString().split("T")[0];
    const to = dateRange.to.toISOString().split("T")[0];
    fetch(`/api/reservations/availability?workspaceId=${selectedWorkspace.id}&startDate=${from}&endDate=${to}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const booked = new Set<string>((data.bookedDates ?? []) as string[]);
        setBookedDates(booked);
        const start = new Date(dateRange.from!);
        const end = new Date(dateRange.to!);
        let totalDays = 0;
        const current = new Date(start);
        while (current <= end) {
          totalDays++;
          current.setDate(current.getDate() + 1);
        }
        setRangeSummary({ total: totalDays, booked: booked.size, available: totalDays - booked.size });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [selectedWorkspace, rangeMode, dateRange]);

  const filteredWorkspaces = useMemo(
    () => workspaces.filter((w) => w.name.toLowerCase().includes(search.toLowerCase())),
    [workspaces, search]
  );

  const isDateBooked = (d: Date) => {
    const key = d.toISOString().split("T")[0];
    return bookedDates.has(key);
  };

  const handleBook = async () => {
    if (!selectedWorkspace || !date) return;
    if (isDateBooked(date)) {
      toast.error("This date is already booked.");
      return;
    }
    const today = startOfDay(new Date());
    if (startOfDay(date) < today) {
      toast.error("Please select a future date.");
      return;
    }
    if (!rangeMode && startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }
    setIsBooking(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: selectedWorkspace.id,
          reservationDate: date.toISOString(),
          startTime: rangeMode ? null : startTime,
          endTime: rangeMode ? null : endTime,
        }),
      });
      if (res.ok) {
        toast.success("Workspace booked successfully!");
        setBookedDates((prev) => new Set([...prev, date.toISOString().split("T")[0]]));
        setDialogOpen(false);
        setDate(undefined);
        setStartTime("09:00");
        setEndTime("17:00");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to book workspace");
      }
    } catch {
      toast.error("An error occurred while booking");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">Find the perfect spot to focus and collaborate.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search workspaces..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background/50" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading workspaces...</div>
      ) : filteredWorkspaces.length === 0 ? (
        <Card className="glass border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <SearchIcon className="h-10 w-10 mb-4 opacity-20" />
            <p>{search ? "No workspaces match your search." : "No workspaces available."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((ws) => (
            <Card key={ws.id} className="glass flex flex-col">
              <CardHeader>
                <CardTitle>{ws.name}</CardTitle>
                <CardDescription className="flex items-center mt-2 capitalize">
                  <LaptopIcon className="mr-1 h-4 w-4" /> {ws.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {ws.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{ws.description}</p>
                )}
                <div className="flex items-center text-sm">
                  <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Capacity: {ws.capacity} people
                </div>
                <div className="flex items-center text-sm font-medium">
                  <NairaIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  ₦{ws.price} / day
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={dialogOpen && selectedWorkspace?.id === ws.id} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setDate(undefined); setBookedDates(new Set()); setRangeMode(false); setDateRange({}); setRangeSummary(null); setStartTime("09:00"); setEndTime("17:00"); } }}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2" onClick={() => { setSelectedWorkspace(ws); setCalendarMonth(new Date()); setDialogOpen(true); }}>
                      <CalendarCheckIcon className="h-4 w-4" />
                      Check Availability
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px] glass-card border-none">
                    <DialogHeader>
                      <DialogTitle>Book {ws.name}</DialogTitle>
                      <DialogDescription>Select a date to reserve this workspace. Booked dates are highlighted in red.</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Button
                        variant={!rangeMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setRangeMode(false); setDateRange({}); setRangeSummary(null); }}
                      >
                        Single Date
                      </Button>
                      <Button
                        variant={rangeMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setRangeMode(true); setDate(undefined); }}
                      >
                        Date Range
                      </Button>
                    </div>
                    {rangeMode && dateRange.from && dateRange.to && rangeSummary && (
                      <div className="mx-2 p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total days:</span>
                          <span className="font-medium">{rangeSummary.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Available:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{rangeSummary.available}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Booked:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">{rangeSummary.booked}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">Select an available date below to book.</p>
                      </div>
                    )}
                    {rangeMode ? (
                      <Calendar
                        mode="range"
                        selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                        onSelect={(range) => {
                          setDateRange(range ?? {});
                          if (range?.from && range?.to) {
                            setDate(range.from);
                          }
                        }}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        disabled={{ before: new Date() }}
                        modifiers={{ booked: isDateBooked }}
                        modifiersStyles={{ booked: { backgroundColor: "oklch(0.6 0.15 20 / 0.15)", color: "oklch(0.6 0.15 20)", textDecoration: "line-through" } }}
                        className="rounded-md border bg-background/50"
                      />
                    ) : (
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        disabled={{ before: new Date() }}
                        modifiers={{ booked: isDateBooked }}
                        modifiersStyles={{ booked: { backgroundColor: "oklch(0.6 0.15 20 / 0.15)", color: "oklch(0.6 0.15 20)", textDecoration: "line-through" } }}
                        className="rounded-md border bg-background/50"
                      />
                    )}
                    {!rangeMode && date && (
                      <div className="grid grid-cols-2 gap-4 mt-2 p-3 border rounded-lg bg-secondary/10">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground block">Start Time</label>
                          <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full text-xs rounded-md border border-input bg-background/50 px-2 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {formatTimeOption(t)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground block">End Time</label>
                          <select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full text-xs rounded-md border border-input bg-background/50 px-2 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {formatTimeOption(t)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/15 border border-primary/30" /> Available</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/15 border border-destructive/30" /> Booked</span>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button onClick={handleBook} disabled={!date || isBooking || isDateBooked(date ?? new Date())}>
                        {isBooking ? "Booking..." : `Book ${date ? date.toLocaleDateString() : "Selected Date"}`}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
