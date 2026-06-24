import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "csv";
    const type = url.searchParams.get("type") || "reservations";

    if (format === "csv") {
      if (type === "venues") {
        const venues = await prisma.venue.findMany({
          include: { _count: { select: { reservations: true } } },
          orderBy: { id: "asc" },
        });

        const headers = ["ID", "Name", "Location", "Description", "Capacity", "Price", "Status", "Total Reservations"];
        const rows = venues.map((v) => [
          v.id,
          v.name,
          v.location,
          v.description,
          v.capacity,
          v.price,
          v.status,
          v._count.reservations,
        ]);

        const csv = [
          headers.join(","),
          ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
          ),
        ].join("\n");

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="venues-${new Date().toISOString().split("T")[0]}.csv"`,
          },
        });
      }

      if (type === "workspaces") {
        const workspaces = await prisma.workspace.findMany({
          include: { _count: { select: { reservations: true } } },
          orderBy: { id: "asc" },
        });

        const headers = ["ID", "Name", "Type", "Description", "Capacity", "Price", "Status", "Total Reservations"];
        const rows = workspaces.map((w) => [
          w.id,
          w.name,
          w.type,
          w.description,
          w.capacity,
          w.price,
          w.status,
          w._count.reservations,
        ]);

        const csv = [
          headers.join(","),
          ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
          ),
        ].join("\n");

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="workspaces-${new Date().toISOString().split("T")[0]}.csv"`,
          },
        });
      }

      // Default: reservations
      const reservations = await prisma.reservation.findMany({
        include: {
          user: { select: { fullname: true, email: true } },
          venue: { select: { name: true, location: true } },
          workspace: { select: { name: true, type: true } },
        },
        orderBy: { reservationDate: "desc" },
      });

      const headers = [
        "ID",
        "User",
        "Email",
        "Resource",
        "Resource Type",
        "Location",
        "Date",
        "Status",
        "Created At",
      ];

      const rows = reservations.map((r) => [
        `RES-${r.id}`,
        r.user.fullname,
        r.user.email,
        r.venue?.name ?? r.workspace?.name ?? "Unknown",
        r.venue ? "Venue" : "Workspace",
        r.venue?.location ?? r.workspace?.type ?? "",
        r.reservationDate.toISOString().split("T")[0],
        r.status,
        r.createdAt.toISOString().split("T")[0],
      ]);

      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="reservations-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // PDF format - return JSON for client-side PDF generation
    if (type === "venues") {
      const venues = await prisma.venue.findMany({
        include: { _count: { select: { reservations: true } } },
        orderBy: { id: "asc" },
      });
      return NextResponse.json(
        venues.map((v) => ({
          id: v.id,
          name: v.name,
          location: v.location,
          description: v.description,
          capacity: v.capacity,
          price: v.price,
          status: v.status,
          totalReservations: v._count.reservations,
        }))
      );
    }

    if (type === "workspaces") {
      const workspaces = await prisma.workspace.findMany({
        include: { _count: { select: { reservations: true } } },
        orderBy: { id: "asc" },
      });
      return NextResponse.json(
        workspaces.map((w) => ({
          id: w.id,
          name: w.name,
          type: w.type,
          description: w.description,
          capacity: w.capacity,
          price: w.price,
          status: w.status,
          totalReservations: w._count.reservations,
        }))
      );
    }

    // Default: reservations
    const reservations = await prisma.reservation.findMany({
      include: {
        user: { select: { fullname: true, email: true } },
        venue: { select: { name: true, location: true } },
        workspace: { select: { name: true, type: true } },
      },
      orderBy: { reservationDate: "desc" },
    });

    const data = reservations.map((r) => ({
      id: r.id,
      user: r.user.fullname,
      email: r.user.email,
      resource: r.venue?.name ?? r.workspace?.name ?? "Unknown",
      resourceType: r.venue ? "Venue" : "Workspace",
      location: r.venue?.location ?? r.workspace?.type ?? "",
      date: r.reservationDate.toISOString().split("T")[0],
      status: r.status,
      createdAt: r.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
