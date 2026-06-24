import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        reservations: {
          select: { id: true, status: true },
        },
      },
      orderBy: { id: "asc" },
    });

    const usersWithStats = users.map((u) => ({
      id: u.id,
      fullname: u.fullname,
      email: u.email,
      role: u.role,
      totalReservations: u.reservations.length,
      activeReservations: u.reservations.filter((r) => r.status !== "Cancelled").length,
    }));

    return NextResponse.json(usersWithStats);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
