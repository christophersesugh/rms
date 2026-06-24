import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { venueSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const venueId = parseInt(id);
    if (isNaN(venueId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const parseResult = venueSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.venue.update({
      where: { id: venueId },
      data: parseResult.data,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const venueId = parseInt(id);
    if (isNaN(venueId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await prisma.venue.delete({ where: { id: venueId } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
