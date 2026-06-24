import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const venueId = url.searchParams.get("venueId");
    const workspaceId = url.searchParams.get("workspaceId");
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!venueId && !workspaceId) {
      return NextResponse.json(
        { message: "venueId or workspaceId is required" },
        { status: 400 }
      );
    }

    let start: Date;
    let end: Date;

    if (startDate && endDate) {
      // Date range mode
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // Month mode (default)
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      const targetMonth = month !== null ? parseInt(month) : new Date().getMonth();
      start = startOfMonth(new Date(targetYear, targetMonth));
      end = endOfMonth(new Date(targetYear, targetMonth));
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        status: { not: "Cancelled" },
        reservationDate: { gte: start, lte: end },
        ...(venueId ? { venueId: parseInt(venueId) } : { workspaceId: parseInt(workspaceId!) }),
      },
      select: {
        reservationDate: true,
      },
    });

    const bookedDates = reservations.map((r) =>
      r.reservationDate.toISOString().split("T")[0]
    );

    return NextResponse.json({ bookedDates });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
