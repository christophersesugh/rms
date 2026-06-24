import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { startOfDay, subDays, format } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const today = startOfDay(new Date());
    const thirtyDaysAgo = subDays(today, 30);

    const reservations = await prisma.reservation.findMany({
      where: {
        reservationDate: { gte: thirtyDaysAgo },
      },
      orderBy: { reservationDate: "asc" },
    });

    const dailyCounts: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const day = format(subDays(today, 29 - i), "MMM dd");
      dailyCounts[day] = 0;
    }

    for (const r of reservations) {
      const day = format(r.reservationDate, "MMM dd");
      if (dailyCounts[day] !== undefined) {
        dailyCounts[day]++;
      }
    }

    const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      reservations: count,
    }));

    return NextResponse.json(chartData);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
