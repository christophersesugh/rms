"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPinIcon, UsersIcon, DollarSignIcon, SearchIcon, CalendarCheckIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

type Venue = {
  id: number;
  name: string;
  location: string;
  description?: string;
  capacity: number;
  price: number;
};

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [rangeMode, setRangeMode] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [rangeSummary, setRangeSummary] = useState<{ total: number; booked: number; available: number } | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    fetch("/api/venues", { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setVenues(data))
      .catch(() => toast.error("Failed to load venues"))
      .finally(() => setIsLoading(false));
    return () => abortController.abort();
  }, []);

  // Fetch availability when venue or month changes
  useEffect(() => {
    if (!selectedVenue) return;
    const controller = new AbortController();
    const month = calendarMonth.getMonth();
    const year = calendarMonth.getFullYear();
    fetch(`/api/reservations/availability?venueId=${selectedVenue.id}&month=${month}&year=${year}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setBookedDates(new Set<string>((data.bookedDates ?? []) as string[])))
      .catch(() => {});
    return () => controller.abort();
  }, [selectedVenue, calendarMonth]);

  // Fetch range availability when date range changes
  useEffect(() => {
    if (!selectedVenue || !rangeMode || !dateRange.from || !dateRange.to) {
      setRangeSummary(null);
      return;
    }
    const controller = new AbortController();
    const from = dateRange.from.toISOString().split("T")[0];
    const to = dateRange.to.toISOString().split("T")[0];
    fetch(`/api/reservations/availability?venueId=${selectedVenue.id}&startDate=${from}&endDate=${to}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const booked = new Set<string>((data.bookedDates ?? []) as string[]);
        setBookedDates(booked);
        // Calculate total days in range
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
  }, [selectedVenue, rangeMode, dateRange]);

  const filteredVenues = useMemo(
    () => venues.filter((v) => v.name.toLowerCase().includes(search.toLowerCase())),
    [venues, search]
  );

  const isDateBooked = (d: Date) => {
    const key = d.toISOString().split("T")[0];
    return bookedDates.has(key);
  };

  const handleBook = async () => {
    if (!selectedVenue || !date) return;
    if (isDateBooked(date)) {
      toast.error("This date is already booked.");
      return;
    }
    const today = startOfDay(new Date());
    if (startOfDay(date) < today) {
      toast.error("Please select a future date.");
      return;
    }
    setIsBooking(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: selectedVenue.id, reservationDate: date.toISOString() }),
      });
      if (res.ok) {
        toast.success("Venue booked successfully!");
        setBookedDates((prev) => new Set([...prev, date.toISOString().split("T")[0]]));
        setDialogOpen(false);
        setDate(undefined);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to book venue");
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
          <h1 className="text-3xl font-bold tracking-tight">Event Venues</h1>
          <p className="text-muted-foreground">Browse and book event spaces for your needs.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search venues..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background/50" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading venues...</div>
      ) : filteredVenues.length === 0 ? (
        <Card className="glass border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <SearchIcon className="h-10 w-10 mb-4 opacity-20" />
            <p>{search ? "No venues match your search." : "No venues available."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="glass flex flex-col">
              <CardHeader>
                <CardTitle>{venue.name}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <MapPinIcon className="mr-1 h-4 w-4" /> {venue.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {venue.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{venue.description}</p>
                )}
                <div className="flex items-center text-sm">
                  <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Capacity: {venue.capacity} people
                </div>
                <div className="flex items-center text-sm font-medium">
                  <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  ${venue.price} / day
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={dialogOpen && selectedVenue?.id === venue.id} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setDate(undefined); setBookedDates(new Set()); setRangeMode(false); setDateRange({}); setRangeSummary(null); } }}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2" onClick={() => { setSelectedVenue(venue); setCalendarMonth(new Date()); setDialogOpen(true); }}>
                      <CalendarCheckIcon className="h-4 w-4" />
                      Check Availability
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px] glass-card border-none">
                    <DialogHeader>
                      <DialogTitle>Book {venue.name}</DialogTitle>
                      <DialogDescription>Select a date to reserve this venue. Booked dates are highlighted in red.</DialogDescription>
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
                            setDate(range.from); // For booking
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
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/15 border border-primary/30" /> Available</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/15 border border-destructive/30" /> Booked</span>
                    </div>
                    <DialogFooter>
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
