import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { message: "Role must be 'user' or 'admin'" },
        { status: 400 }
      );
    }

    // Prevent demoting yourself
    if (session?.user?.id && userId === parseInt(session.user.id) && role !== "admin") {
      return NextResponse.json(
        { message: "Cannot change your own admin role" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, fullname: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Prevent deleting yourself
    if (session?.user?.id && userId === parseInt(session.user.id)) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Cancel all active reservations first
    await prisma.reservation.updateMany({
      where: { userId, status: { not: "Cancelled" } },
      data: { status: "Cancelled" },
    });

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
