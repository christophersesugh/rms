"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, TrashIcon, PencilIcon, LaptopIcon, ArrowRightIcon, Loader2Icon, ClockIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { startOfDay } from "date-fns";
import Link from "next/link";

type Reservation = {
  id: number;
  reservationDate: string;
  startTime?: string | null;
  endTime?: string | null;
  status: string;
  venue?: { name: string; location: string };
  workspace?: { name: string; type: string };
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

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  Cancelled: "bg-destructive/15 text-destructive border border-destructive/20",
  Pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingReservationId, setEditingReservationId] = useState<number | null>(null);
  const [cancellingReservationId, setCancellingReservationId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(new Date());
  const [editStartTime, setEditStartTime] = useState("09:00");
  const [editEndTime, setEditEndTime] = useState("17:00");

  useEffect(() => {
    const abortController = new AbortController();

    fetch("/api/reservations", { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReservations(data);
        }
      })
      .catch(() => toast.error("Failed to load reservations"))
      .finally(() => setIsLoading(false));

    return () => abortController.abort();
  }, []);

  const handleCancelConfirm = async () => {
    if (cancellingReservationId === null) return;
    const id = cancellingReservationId;
    setCancellingId(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Reservation cancelled");
        setCancellingReservationId(null);
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r))
        );
      } else {
        toast.error("Failed to cancel reservation");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setCancellingId(null);
    }
  };

  const handleEdit = async () => {
    if (editingReservationId === null || !editDate) return;

    const today = startOfDay(new Date());
    if (startOfDay(editDate) < today) {
      toast.error("Please select a future date.");
      return;
    }
    if (editStartTime >= editEndTime) {
      toast.error("End time must be after start time.");
      return;
    }

    setSavingId(editingReservationId);
    try {
      const res = await fetch(`/api/reservations/${editingReservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationDate: editDate.toISOString(),
          startTime: editStartTime,
          endTime: editEndTime,
        }),
      });

      if (res.ok) {
        toast.success("Reservation updated");
        setEditingReservationId(null);
        setReservations((prev) =>
          prev.map((r) =>
            r.id === editingReservationId
              ? {
                  ...r,
                  reservationDate: editDate.toISOString(),
                  startTime: editStartTime,
                  endTime: editEndTime,
                }
              : r
          )
        );
      } else {
        toast.error("Failed to update reservation");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setEditingReservationId(null);
      setSavingId(null);
    }
  };

  const activeReservations = reservations.filter((r) => r.status !== "Cancelled");
  const cancelledReservations = reservations.filter((r) => r.status === "Cancelled");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Reservations</h1>
        <p className="text-muted-foreground mt-1">Manage your upcoming and past bookings.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <Card className="glass border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mb-3 opacity-20" />
            <p className="font-medium">No reservations yet</p>
            <p className="text-sm mt-1 mb-4">Browse venues or workspaces to make your first booking</p>
            <Link href="/venues">
              <Button>
                Browse Venues <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeReservations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Active ({activeReservations.length})
              </h2>
              {activeReservations.map((res) => (
                <ReservationCard
                  key={res.id}
                  reservation={res}
                  editDialogOpen={editingReservationId === res.id}
                  setEditDialogOpen={(open) => setEditingReservationId(open ? res.id : null)}
                  editDate={editDate}
                  setEditDate={setEditDate}
                  editStartTime={editStartTime}
                  setEditStartTime={setEditStartTime}
                  editEndTime={editEndTime}
                  setEditEndTime={setEditEndTime}
                  onEditClick={() => {
                    setEditingReservationId(res.id);
                    setEditDate(new Date(res.reservationDate));
                    setEditStartTime(res.startTime || "09:00");
                    setEditEndTime(res.endTime || "17:00");
                  }}
                  handleEdit={handleEdit}
                  savingId={savingId}
                  cancelDialogOpen={cancellingReservationId === res.id}
                  setCancelDialogOpen={(open) => setCancellingReservationId(open ? res.id : null)}
                  cancellingId={cancellingId}
                  onConfirmCancel={handleCancelConfirm}
                />
              ))}
            </div>
          )}

          {cancelledReservations.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-muted-foreground">
                Cancelled ({cancelledReservations.length})
              </h2>
              {cancelledReservations.map((res) => (
                <ReservationCard
                  key={res.id}
                  reservation={res}
                  editDialogOpen={false}
                  setEditDialogOpen={() => {}}
                  editDate={editDate}
                  setEditDate={setEditDate}
                  handleEdit={handleEdit}
                  savingId={null}
                  cancelDialogOpen={false}
                  setCancelDialogOpen={() => {}}
                  cancellingId={null}
                  onConfirmCancel={() => {}}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReservationCard({
  reservation,
  editDialogOpen,
  setEditDialogOpen,
  editDate,
  setEditDate,
  editStartTime = "09:00",
  setEditStartTime = () => {},
  editEndTime = "17:00",
  setEditEndTime = () => {},
  onEditClick = () => {},
  handleEdit,
  savingId,
  cancelDialogOpen,
  setCancelDialogOpen,
  cancellingId,
  onConfirmCancel,
}: {
  reservation: Reservation;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editDate: Date | undefined;
  setEditDate: (date: Date | undefined) => void;
  editStartTime?: string;
  setEditStartTime?: (t: string) => void;
  editEndTime?: string;
  setEditEndTime?: (t: string) => void;
  onEditClick?: () => void;
  handleEdit: () => void;
  savingId: number | null;
  cancelDialogOpen: boolean;
  setCancelDialogOpen: (open: boolean) => void;
  cancellingId: number | null;
  onConfirmCancel: () => void;
}) {
  const res = reservation;
  const isVenue = !!res.venue;
  const isCancelled = res.status === "Cancelled";
  const resourceName = res.venue?.name ?? res.workspace?.name ?? "Unknown";

  return (
    <Card className={cn("glass", isCancelled && "opacity-60")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-xl shrink-0",
            isCancelled ? "bg-muted" : "bg-primary/10"
          )}>
            {isVenue ? (
              <MapPinIcon className={cn("h-5 w-5", isCancelled ? "text-muted-foreground" : "text-primary")} />
            ) : (
              <LaptopIcon className={cn("h-5 w-5", isCancelled ? "text-muted-foreground" : "text-primary")} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{resourceName}</h3>
              <span className="text-xs text-muted-foreground font-mono">RES-{res.id}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {new Date(res.reservationDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {res.startTime && res.endTime && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 bg-secondary/35 px-1.5 py-0.5 rounded text-xs font-medium">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {formatTimeOption(res.startTime)} - {formatTimeOption(res.endTime)}
                  </span>
                </>
              )}
              <span>·</span>
              <span>{isVenue ? (res.venue as { location: string }).location : (res.workspace as { type: string }).type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:ml-auto">
          <span className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full",
            statusStyles[res.status] ?? "bg-muted text-muted-foreground"
          )}>
            {res.status}
          </span>

          {!isCancelled && (
            <>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onEditClick}>
                    <PencilIcon className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card border-none">
                  <DialogHeader>
                    <DialogTitle>Edit Reservation</DialogTitle>
                    <DialogDescription>
                      Change the date for your reservation at {resourceName}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center py-4">
                    <Calendar
                      mode="single"
                      selected={editDate}
                      onSelect={setEditDate}
                      disabled={{ before: new Date() }}
                      className="rounded-md border bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2 px-6 pb-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground block">Start Time</label>
                      <select
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
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
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(e.target.value)}
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
                  <DialogFooter>
                    <Button onClick={handleEdit} disabled={!editDate || savingId !== null}>
                      {savingId !== null ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <TrashIcon className="h-3.5 w-3.5 mr-1.5" />
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card border-none">
                  <DialogHeader>
                    <DialogTitle>Cancel Reservation</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your reservation for {resourceName}?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={onConfirmCancel}
                      disabled={cancellingId === res.id}
                    >
                      {cancellingId === res.id ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Yes, cancel booking"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
