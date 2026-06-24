import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      fullname: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      fullname: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "user",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      fullname: "Mary James",
      email: "mary@example.com",
      password: hashedPassword,
      role: "user",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      fullname: "Ahmed Musa",
      email: "ahmed@example.com",
      password: hashedPassword,
      role: "user",
    },
  });

  // Create venues
  const venue1 = await prisma.venue.create({
    data: {
      name: "Conference Hall A",
      location: "Building A, 1st Floor",
      description: "Large conference hall suitable for seminars and workshops with full AV equipment.",
      capacity: 200,
      price: 500.0,
      status: "available",
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: "Seminar Hall B",
      location: "Building B, 2nd Floor",
      description: "Medium-sized seminar hall for team meetings and training sessions.",
      capacity: 100,
      price: 300.0,
      status: "available",
    },
  });

  const venue3 = await prisma.venue.create({
    data: {
      name: "Training Room C",
      location: "Building C, Ground Floor",
      description: "Small training room ideal for workshops and presentations.",
      capacity: 50,
      price: 150.0,
      status: "available",
    },
  });

  // Create workspaces
  const workspace1 = await prisma.workspace.create({
    data: {
      name: "Workspace A",
      type: "Hot Desk",
      description: "Flexible hot desk in the open co-working area.",
      capacity: 1,
      price: 25.0,
      status: "available",
    },
  });

  const workspace2 = await prisma.workspace.create({
    data: {
      name: "Workspace B",
      type: "Private Office",
      description: "Private office space with door lock and dedicated internet.",
      capacity: 4,
      price: 100.0,
      status: "available",
    },
  });

  const workspace3 = await prisma.workspace.create({
    data: {
      name: "Workspace C",
      type: "Meeting Room",
      description: "Small meeting room with whiteboard and video conferencing.",
      capacity: 8,
      price: 75.0,
      status: "available",
    },
  });

  // Create reservations
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.reservation.create({
    data: {
      userId: user1.id,
      venueId: venue1.id,
      reservationDate: tomorrow,
      status: "Confirmed",
    },
  });

  await prisma.reservation.create({
    data: {
      userId: user2.id,
      workspaceId: workspace2.id,
      reservationDate: nextWeek,
      status: "Confirmed",
    },
  });

  await prisma.reservation.create({
    data: {
      userId: user3.id,
      venueId: venue2.id,
      reservationDate: nextWeek,
      status: "Confirmed",
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
