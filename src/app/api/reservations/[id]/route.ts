import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { cancelReservationSchema, updateReservationSchema } from "@/lib/validations";

async function getReservationOrThrow(id: string, sessionUserId: string, sessionRole: string) {
  const parseResult = cancelReservationSchema.safeParse({ id });
  if (!parseResult.success) {
    throw new ValidationError("Invalid ID");
  }
  const reservationId = parseInt(parseResult.data.id);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new NotFoundError("Reservation not found");
  }

  if (reservation.userId !== parseInt(sessionUserId) && sessionRole !== "admin") {
    throw new ForbiddenError();
  }

  return reservation;
}

class ValidationError extends Error { status = 400; }
class NotFoundError extends Error { status = 404; }
class ForbiddenError extends Error { status = 403; }

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await getReservationOrThrow(id, session.user.id!, (session.user as any).role ?? "user");

    const body = await req.json();
    const parseResult = updateReservationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const reservationId = parseInt(id);
    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: { reservationDate: new Date(parseResult.data.reservationDate) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reservation = await getReservationOrThrow(id, session.user.id!, (session.user as any).role ?? "user");

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: "Cancelled" },
    });

    return NextResponse.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: "Forbidden" }, { status: error.status });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
