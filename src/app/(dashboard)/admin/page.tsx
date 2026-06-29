"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPinIcon, UsersIcon, CalendarIcon, LaptopIcon, PlusIcon, PencilIcon, TrashIcon, FileTextIcon, FileSpreadsheetIcon, Loader2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Stats = {
  userCount: number;
  venueCount: number;
  workspaceCount: number;
  reservationCount: number;
};

type Venue = { id: number; name: string; location: string; description: string; capacity: number; price: number };
type Workspace = { id: number; name: string; type: string; description: string; capacity: number; price: number };
type ChartData = { date: string; reservations: number }[];

const emptyVenue = { name: "", location: "", description: "", capacity: 0, price: 0 };
const emptyWorkspace = { name: "", type: "", description: "", capacity: 0, price: 0 };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [chartData, setChartData] = useState<ChartData>([]);
  const [activeTab, setActiveTab] = useState<"venues" | "workspaces">("venues");
  const [editVenue, setEditVenue] = useState<Venue | typeof emptyVenue | null>(null);
  const [editWorkspace, setEditWorkspace] = useState<Workspace | typeof emptyWorkspace | null>(null);
  const [venueDialogOpen, setVenueDialogOpen] = useState(false);
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/venues").then((r) => r.json()).then(setVenues).catch(() => {});
    fetch("/api/workspaces").then((r) => r.json()).then(setWorkspaces).catch(() => {});
    fetch("/api/admin/stats").then((r) => r.json()).then(setChartData).catch(() => {});
    fetch("/api/reservations?all=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStats({
            userCount: new Set(data.map((r: { userId: number }) => r.userId)).size,
            venueCount: 0,
            workspaceCount: 0,
            reservationCount: data.length,
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    const abort = new AbortController();

    Promise.all([
      fetch("/api/venues", { signal: abort.signal }).then((r) => r.json()),
      fetch("/api/workspaces", { signal: abort.signal }).then((r) => r.json()),
      fetch("/api/admin/stats", { signal: abort.signal }).then((r) => r.json()),
      fetch("/api/reservations?all=true", { signal: abort.signal })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setStats({
              userCount: new Set(data.map((r: { userId: number }) => r.userId)).size,
              venueCount: 0,
              workspaceCount: 0,
              reservationCount: data.length,
            });
          }
        }),
    ])
      .then(([v, w, c]) => {
        setVenues(v);
        setWorkspaces(w);
        setChartData(c);
        setStats((prev) => prev ? { ...prev, venueCount: v.length, workspaceCount: w.length } : null);
      })
      .catch(() => {});

    return () => abort.abort();
  }, []);

  const handleSaveVenue = async () => {
    if (!editVenue) return;
    const { name, location, capacity, price } = editVenue as Venue;
    if (!name || !location || capacity <= 0 || price <= 0) {
      toast.error("Please fill in all fields with valid values.");
      return;
    }

    setSaving(true);
    try {
      const isNew = !("id" in editVenue);
      const url = isNew ? "/api/venues" : `/api/venues/${(editVenue as Venue).id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, description: editVenue.description || "", capacity: Number(capacity), price: Number(price) }),
      });

      if (res.ok) {
        toast.success(isNew ? "Venue created" : "Venue updated");
        setVenueDialogOpen(false);
        setEditVenue(null);
        loadData();
      } else {
        toast.error("Failed to save venue");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVenue = async (id: number) => {
    try {
      const res = await fetch(`/api/venues/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Venue deleted");
        loadData();
      } else {
        toast.error("Failed to delete venue");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleSaveWorkspace = async () => {
    if (!editWorkspace) return;
    const { name, type, capacity, price } = editWorkspace as Workspace;
    if (!name || !type || capacity <= 0 || price <= 0) {
      toast.error("Please fill in all fields with valid values.");
      return;
    }

    setSaving(true);
    try {
      const isNew = !("id" in editWorkspace);
      const url = isNew ? "/api/workspaces" : `/api/workspaces/${(editWorkspace as Workspace).id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, description: editWorkspace.description || "", capacity: Number(capacity), price: Number(price) }),
      });

      if (res.ok) {
        toast.success(isNew ? "Workspace created" : "Workspace updated");
        setWorkspaceDialogOpen(false);
        setEditWorkspace(null);
        loadData();
      } else {
        toast.error("Failed to save workspace");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorkspace = async (id: number) => {
    try {
      const res = await fetch(`/api/workspaces/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Workspace deleted");
        loadData();
      } else {
        toast.error("Failed to delete workspace");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleExportCSV = async (type: "reservations" | "venues" | "workspaces") => {
    setExporting(type);
    try {
      const res = await fetch(`/api/admin/export?type=${type}&format=csv`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`${type} exported as CSV`);
      } else {
        toast.error(`Failed to export ${type}`);
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async (type: "reservations" | "venues" | "workspaces") => {
    setExporting(`${type}-pdf`);
    try {
      const res = await fetch(`/api/admin/export?type=${type}&format=pdf`);
      if (res.ok) {
        const data = await res.json();
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        // Generate simple HTML-based PDF using print
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          let rows = "";
          if (type === "reservations") {
            rows = data.map((r: { id: number; user: string; resource: string; resourceType: string; date: string; status: string }) =>
              `<tr><td>RES-${r.id}</td><td>${r.user}</td><td>${r.resource}</td><td>${r.resourceType}</td><td>${r.date}</td><td>${r.status}</td></tr>`
            ).join("");
          } else if (type === "venues") {
            rows = data.map((v: { id: number; name: string; location: string; capacity: number; price: number; status: string }) =>
              `<tr><td>${v.id}</td><td>${v.name}</td><td>${v.location}</td><td>${v.capacity}</td><td>$${v.price}</td><td>${v.status}</td></tr>`
            ).join("");
          } else {
            rows = data.map((w: { id: number; name: string; type: string; capacity: number; price: number; status: string }) =>
              `<tr><td>${w.id}</td><td>${w.name}</td><td>${w.type}</td><td>${w.capacity}</td><td>$${w.price}</td><td>${w.status}</td></tr>`
            ).join("");
          }
          let headers = "";
          if (type === "reservations") {
            headers = "<th>ID</th><th>User</th><th>Resource</th><th>Type</th><th>Date</th><th>Status</th>";
          } else if (type === "venues") {
            headers = "<th>ID</th><th>Name</th><th>Location</th><th>Capacity</th><th>Price</th><th>Status</th>";
          } else {
            headers = "<th>ID</th><th>Name</th><th>Type</th><th>Capacity</th><th>Price</th><th>Status</th>";
          }
          printWindow.document.write(`
            <html><head><title>${title} Report</title>
            <style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}tr:nth-child(even){background:#fafafa}</style>
            </head><body><h1>${title} Report</h1><p>Generated ${new Date().toLocaleDateString()}</p>
            <table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></body></html>
          `);
          printWindow.document.close();
          printWindow.print();
          toast.success(`${title} PDF ready`);
        } else {
          toast.warning("Please allow popups to export PDF");
        }
      } else {
        toast.error(`Failed to export ${type}`);
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview, management, and statistics.</p>
      </div>

      {/* Export Buttons */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Export Data</CardTitle>
            <CardDescription>Download system data as CSV files or print-ready PDF reports.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["reservations", "venues", "workspaces"].map((type) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="font-medium capitalize">{type}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportCSV(type as "reservations" | "venues" | "workspaces")}
                    disabled={!!exporting}
                    className="gap-2"
                  >
                    {exporting === type ? (
                      <Loader2Icon className="h-3 w-3 animate-spin" />
                    ) : (
                      <FileSpreadsheetIcon className="h-3 w-3" />
                    )}
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportPDF(type as "reservations" | "venues" | "workspaces")}
                    disabled={!!exporting}
                    className="gap-2"
                  >
                    {exporting === `${type}-pdf` ? (
                      <Loader2Icon className="h-3 w-3 animate-spin" />
                    ) : (
                      <FileTextIcon className="h-3 w-3" />
                    )}
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Venues", value: venues.length, icon: MapPinIcon },
          { title: "Total Workspaces", value: workspaces.length, icon: LaptopIcon },
          { title: "Total Reservations", value: stats?.reservationCount ?? 0, icon: CalendarIcon },
          { title: "Active Users", value: stats?.userCount ?? 0, icon: UsersIcon },
        ].map((stat) => (
          <Card key={stat.title} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Reservations (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
                  />
                  <Bar dataKey="reservations" fill="oklch(0.7 0.15 250)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Management */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Management</CardTitle>
            <CardDescription>Create, edit, and remove venues and workspaces.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "venues" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("venues")}
            >
              Venues
            </Button>
            <Button
              variant={activeTab === "workspaces" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("workspaces")}
            >
              Workspaces
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "venues" ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => { setEditVenue({ ...emptyVenue }); setVenueDialogOpen(true); }}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Venue
              </Button>

              {venues.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-sm text-muted-foreground">{v.location} &middot; Cap: {v.capacity} &middot; ₦{v.price}/day</p>
                    {v.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{v.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditVenue(v); setVenueDialogOpen(true); }}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteVenue(v.id)}>
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => { setEditWorkspace({ ...emptyWorkspace }); setWorkspaceDialogOpen(true); }}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Workspace
              </Button>

              {workspaces.map((w) => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">{w.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{w.type} &middot; Cap: {w.capacity} &middot; ₦{w.price}/day</p>
                    {w.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{w.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditWorkspace(w); setWorkspaceDialogOpen(true); }}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteWorkspace(w.id)}>
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Venue Dialog */}
      <Dialog open={venueDialogOpen} onOpenChange={setVenueDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-none">
          <DialogHeader>
            <DialogTitle>{editVenue && "id" in editVenue ? "Edit Venue" : "Add Venue"}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          {editVenue && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="v-name">Name</Label>
                <Input id="v-name" value={editVenue.name} onChange={(e) => setEditVenue({ ...editVenue, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-location">Location</Label>
                <Input id="v-location" value={editVenue.location} onChange={(e) => setEditVenue({ ...editVenue, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-description">Description</Label>
                <Input id="v-description" value={editVenue.description || ""} onChange={(e) => setEditVenue({ ...editVenue, description: e.target.value })} placeholder="Brief description of the venue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="v-capacity">Capacity</Label>
                  <Input id="v-capacity" type="number" value={editVenue.capacity} onChange={(e) => setEditVenue({ ...editVenue, capacity: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="v-price">Price (₦/day)</Label>
                  <Input id="v-price" type="number" step="0.01" value={editVenue.price} onChange={(e) => setEditVenue({ ...editVenue, price: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveVenue} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workspace Dialog */}
      <Dialog open={workspaceDialogOpen} onOpenChange={setWorkspaceDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass-card border-none">
          <DialogHeader>
            <DialogTitle>{editWorkspace && "id" in editWorkspace ? "Edit Workspace" : "Add Workspace"}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          {editWorkspace && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="w-name">Name</Label>
                <Input id="w-name" value={editWorkspace.name} onChange={(e) => setEditWorkspace({ ...editWorkspace, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="w-type">Type</Label>
                <Input id="w-type" value={editWorkspace.type} onChange={(e) => setEditWorkspace({ ...editWorkspace, type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="w-description">Description</Label>
                <Input id="w-description" value={editWorkspace.description || ""} onChange={(e) => setEditWorkspace({ ...editWorkspace, description: e.target.value })} placeholder="Brief description of the workspace" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="w-capacity">Capacity</Label>
                  <Input id="w-capacity" type="number" value={editWorkspace.capacity} onChange={(e) => setEditWorkspace({ ...editWorkspace, capacity: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="w-price">Price (₦/day)</Label>
                  <Input id="w-price" type="number" step="0.01" value={editWorkspace.price} onChange={(e) => setEditWorkspace({ ...editWorkspace, price: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveWorkspace} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
