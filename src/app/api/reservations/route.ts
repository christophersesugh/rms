import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { reservationSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "true";

    if (all && (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const reservations = await prisma.reservation.findMany({
      where: all ? {} : { userId: parseInt(session.user.id!) },
      include: {
        venue: true,
        workspace: true,
      },
      orderBy: { reservationDate: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = reservationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { venueId, workspaceId, reservationDate } = parseResult.data;

    // Prevent double-booking: check if resource is already reserved on this date
    const conflict = await prisma.reservation.findFirst({
      where: {
        reservationDate: new Date(reservationDate),
        status: { not: "Cancelled" },
        ...(venueId ? { venueId } : { workspaceId: workspaceId! }),
      },
    });

    if (conflict) {
      return NextResponse.json(
        { message: "This resource is already reserved for the selected date." },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: parseInt(session.user.id!),
        venueId: venueId ?? null,
        workspaceId: workspaceId ?? null,
        reservationDate: new Date(reservationDate),
        status: "Confirmed",
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Reservation Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
