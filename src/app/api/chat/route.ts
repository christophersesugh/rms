// @ts-nocheck AI SDK tool types don't resolve through pnpm re-exports — runtime is correct
import { openai } from "@ai-sdk/openai";
import { streamText, tool, jsonSchema, stepCountIs } from "ai";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const maxDuration = 30;

// Bust the cached server-rendered data for pages that show reservations/availability
// so the user sees changes as soon as the agent finishes a booking action.
function revalidateDashboard() {
  for (const path of [
    "/dashboard",
    "/reservations",
    "/venues",
    "/workspaces",
    "/admin",
  ]) {
    revalidatePath(path);
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const rawMessages = body.messages;

  if (!Array.isArray(rawMessages)) {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }

  // Transform UIMessage[] (from @ai-sdk/react useChat) to ModelMessage[] (for streamText)
  const messages = rawMessages
    .map((msg: any) => ({
      role: msg.role as "user" | "assistant" | "system",
      content:
        msg.parts
          ?.filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("") ??
        msg.content ??
        "",
    }))
    .filter((m: any) => m.content);

  if (messages.length === 0) {
    return Response.json(
      { message: "No valid messages provided" },
      { status: 400 },
    );
  }

  const userId = parseInt(session.user.id!);
  const userRole = session.user.role;

  const today = new Date().toISOString().split("T")[0];

  let result;
  try {
    result = await streamText({
      model: openai("gpt-4o"),
      stopWhen: stepCountIs(8),
      system: `You are a helpful AI assistant for Abutu, an automated event venue and workspace reservation system.
You help users find, book, modify, and cancel venues and workspaces.
Be polite, concise, and helpful.

Today's date is ${today}. Always use real dates that are today or in the future. NEVER invent or use past dates.

Tool usage:
- searchResources: find venues/workspaces matching criteria (location/address, capacity, price, workspace type). Use this when the user describes what they want rather than naming a specific resource (e.g. "a venue downtown for 100 people", "a meeting room under ₦50").
- findNextAvailable: find the EARLIEST available resource matching optional criteria. Use this for "book the next available venue/workspace" or "what's the soonest I can get a workspace".
- checkAvailability: check whether a specific named resource is free on a specific date.
- createReservation: make a booking. Call this after the resource and date are known. You can optionally collect and pass startTime and endTime (in 24h HH:MM format) if specified by the user to serve as a reminder.
- updateReservation: change the date and/or times of an existing reservation (identified by its numeric ID).
- cancelReservation: cancel an existing reservation (identified by its numeric ID).
- listReservations: show the user's current reservations.

Rules:
- "Book the next available …": call findNextAvailable, then go ahead and createReservation for what it returns, then tell the user what you booked (RES-id, resource, date). The user already asked to book, so you do not need to ask again — but never book if findNextAvailable finds nothing.
- "Find / search / show me options": call searchResources and present the matches; do not book until the user picks one.
- Booking a specific named resource: if the user gave a date, you may book it (optionally check availability first). If no date was given, ask for one — do not invent a date or loop over many dates.
- Call checkAvailability only for the single date the user asked about — never loop over multiple dates.
- After any tool runs, reply in plain language summarizing what happened.
- To cancel or update, you need the reservation's numeric ID. If the user refers to a reservation without a clear ID, call listReservations first and ask which one they mean.
- When listing reservations or search results, show each as RES-{id} (for reservations) or with the resource name, location/type, capacity, price, and start/end times if set.
- When reporting availability, also include the resource's capacity and price.
- Start and End Times: Users can specify reservation hours (e.g. 10:00 to 14:00 or 9 AM to 5 PM). When booking or updating, try to extract these times and pass them to tools in HH:MM format. If times are set, include them in your text responses to remind the user.`,
    messages,
    tools: {
      searchResources: tool({
        description:
          "Search for venues or workspaces by criteria such as location/address, capacity, price, or workspace type. Returns matching resources without checking a specific date.",
        inputSchema: jsonSchema<{
          resourceType: "venue" | "workspace";
          location?: string;
          type?: string;
          minCapacity?: number;
          maxPrice?: number;
        }>({
          type: "object",
          properties: {
            resourceType: { type: "string", enum: ["venue", "workspace"], description: "Type of resource" },
            location: { type: "string", description: "Address or location to match (venues only)" },
            type: { type: "string", description: "Workspace type, e.g. Hot Desk, Private Office, Meeting Room (workspaces only)" },
            minCapacity: { type: "number", description: "Minimum capacity required" },
            maxPrice: { type: "number", description: "Maximum price per day" },
          },
          required: ["resourceType"],
          additionalProperties: false,
        }),
        execute: async ({ resourceType, location, type, minCapacity, maxPrice }) => {
          if (resourceType === "venue") {
            const venues = await prisma.venue.findMany({
              where: {
                status: "available",
                ...(location ? { location: { contains: location } } : {}),
                ...(minCapacity ? { capacity: { gte: minCapacity } } : {}),
                ...(maxPrice ? { price: { lte: maxPrice } } : {}),
              },
              orderBy: { price: "asc" },
              take: 10,
            });
            return {
              count: venues.length,
              resources: venues.map((v) => ({
                name: v.name,
                location: v.location,
                capacity: v.capacity,
                price: String(v.price),
              })),
              message: venues.length
                ? `Found ${venues.length} venue(s).`
                : "No venues match those criteria.",
            };
          } else {
            const workspaces = await prisma.workspace.findMany({
              where: {
                status: "available",
                ...(type ? { type: { contains: type } } : {}),
                ...(minCapacity ? { capacity: { gte: minCapacity } } : {}),
                ...(maxPrice ? { price: { lte: maxPrice } } : {}),
              },
              orderBy: { price: "asc" },
              take: 10,
            });
            return {
              count: workspaces.length,
              resources: workspaces.map((w) => ({
                name: w.name,
                type: w.type,
                capacity: w.capacity,
                price: String(w.price),
              })),
              message: workspaces.length
                ? `Found ${workspaces.length} workspace(s).`
                : "No workspaces match those criteria.",
            };
          }
        },
      }),
      findNextAvailable: tool({
        description:
          "Find the earliest available venue or workspace matching optional criteria (location, capacity, price, type). Use for requests like 'book the next available workspace'. Returns a single resource and the soonest free date.",
        inputSchema: jsonSchema<{
          resourceType: "venue" | "workspace";
          location?: string;
          type?: string;
          minCapacity?: number;
          maxPrice?: number;
          fromDate?: string;
        }>({
          type: "object",
          properties: {
            resourceType: { type: "string", enum: ["venue", "workspace"], description: "Type of resource" },
            location: { type: "string", description: "Address or location to match (venues only)" },
            type: { type: "string", description: "Workspace type (workspaces only)" },
            minCapacity: { type: "number", description: "Minimum capacity required" },
            maxPrice: { type: "number", description: "Maximum price per day" },
            fromDate: { type: "string", description: "ISO date to start searching from; defaults to today" },
          },
          required: ["resourceType"],
          additionalProperties: false,
        }),
        execute: async ({ resourceType, location, type, minCapacity, maxPrice, fromDate }) => {
          const SEARCH_DAYS = 30;
          const start = fromDate ? new Date(fromDate) : new Date();
          start.setUTCHours(0, 0, 0, 0);
          const windowEnd = new Date(start);
          windowEnd.setUTCDate(windowEnd.getUTCDate() + SEARCH_DAYS);

          const isVenue = resourceType === "venue";
          const candidates = isVenue
            ? await prisma.venue.findMany({
                where: {
                  status: "available",
                  ...(location ? { location: { contains: location } } : {}),
                  ...(minCapacity ? { capacity: { gte: minCapacity } } : {}),
                  ...(maxPrice ? { price: { lte: maxPrice } } : {}),
                },
                orderBy: { price: "asc" },
              })
            : await prisma.workspace.findMany({
                where: {
                  status: "available",
                  ...(type ? { type: { contains: type } } : {}),
                  ...(minCapacity ? { capacity: { gte: minCapacity } } : {}),
                  ...(maxPrice ? { price: { lte: maxPrice } } : {}),
                },
                orderBy: { price: "asc" },
              });

          if (candidates.length === 0) {
            return { found: false, message: "No resources match those criteria." };
          }

          const ids = candidates.map((c) => c.id);
          const reservations = await prisma.reservation.findMany({
            where: {
              ...(isVenue ? { venueId: { in: ids } } : { workspaceId: { in: ids } }),
              status: { not: "Cancelled" },
              reservationDate: { gte: start, lt: windowEnd },
            },
          });
          const taken = new Set(
            reservations.map(
              (r) =>
                `${isVenue ? r.venueId : r.workspaceId}|${r.reservationDate
                  .toISOString()
                  .split("T")[0]}`,
            ),
          );

          for (let d = 0; d < SEARCH_DAYS; d++) {
            const day = new Date(start);
            day.setUTCDate(day.getUTCDate() + d);
            const iso = day.toISOString().split("T")[0];
            for (const c of candidates) {
              if (!taken.has(`${c.id}|${iso}`)) {
                return {
                  found: true,
                  resourceType,
                  resourceName: c.name,
                  ...(isVenue
                    ? { location: (c as { location: string }).location }
                    : { workspaceType: (c as { type: string }).type }),
                  capacity: c.capacity,
                  price: String(c.price),
                  date: iso,
                  message: `${c.name} (capacity ${c.capacity}, ₦${c.price}/day) is available on ${iso}.`,
                };
              }
            }
          }

          return {
            found: false,
            message: `No availability found in the next ${SEARCH_DAYS} days.`,
          };
        },
      }),
      checkAvailability: tool({
        description:
          "Check if a specific venue or workspace is available on a given date.",
        inputSchema: jsonSchema<{
          resourceType: "venue" | "workspace";
          resourceName: string;
          date: string;
        }>({
          type: "object",
          properties: {
            resourceType: { type: "string", enum: ["venue", "workspace"], description: "Type of resource" },
            resourceName: { type: "string", description: "Name of the venue or workspace" },
            date: { type: "string", description: "ISO date string for the reservation" },
          },
          required: ["resourceType", "resourceName", "date"],
          additionalProperties: false,
        }),
        execute: async ({ resourceType, resourceName, date }) => {
          if (resourceType === "venue") {
            const venue = await prisma.venue.findFirst({
              where: { name: { contains: resourceName } },
            });
            if (!venue)
              return {
                status: "not_found",
                message: `Venue "${resourceName}" not found.`,
              };

            const reservation = await prisma.reservation.findFirst({
              where: {
                venueId: venue.id,
                reservationDate: new Date(date),
                status: { not: "Cancelled" },
              },
            });
            return {
              available: !reservation,
              message: reservation
                ? `${venue.name} is already booked on ${date}.`
                : `${venue.name} (capacity: ${venue.capacity}, ₦${venue.price}/day) is available on ${date}.`,
            };
          } else {
            const workspace = await prisma.workspace.findFirst({
              where: { name: { contains: resourceName } },
            });
            if (!workspace)
              return {
                status: "not_found",
                message: `Workspace "${resourceName}" not found.`,
              };

            const reservation = await prisma.reservation.findFirst({
              where: {
                workspaceId: workspace.id,
                reservationDate: new Date(date),
                status: { not: "Cancelled" },
              },
            });
            return {
              available: !reservation,
              message: reservation
                ? `${workspace.name} is already booked on ${date}.`
                : `${workspace.name} (${workspace.type}, capacity: ${workspace.capacity}, ₦${workspace.price}/day) is available on ${date}.`,
            };
          }
        },
      }),
      createReservation: tool({
        description: "Book a venue or workspace for the user with optional start and end times.",
        inputSchema: jsonSchema<{
          resourceType: "venue" | "workspace";
          resourceName: string;
          date: string;
          startTime?: string;
          endTime?: string;
        }>({
          type: "object",
          properties: {
            resourceType: { type: "string", enum: ["venue", "workspace"], description: "Type of resource" },
            resourceName: { type: "string", description: "Name of the venue or workspace" },
            date: { type: "string", description: "ISO date string for the reservation" },
            startTime: { type: "string", description: "Start time of booking in 24h format (HH:MM, e.g. '09:00')" },
            endTime: { type: "string", description: "End time of booking in 24h format (HH:MM, e.g. '17:00')" },
          },
          required: ["resourceType", "resourceName", "date"],
          additionalProperties: false,
        }),
        execute: async ({ resourceType, resourceName, date, startTime, endTime }) => {
          let venueId = null;
          let workspaceId = null;

          if (resourceType === "venue") {
            const venue = await prisma.venue.findFirst({
              where: { name: { contains: resourceName } },
            });
            if (!venue) return { success: false, message: "Venue not found." };
            venueId = venue.id;

            const existing = await prisma.reservation.findFirst({
              where: {
                venueId,
                reservationDate: new Date(date),
                status: { not: "Cancelled" },
              },
            });
            if (existing)
              return {
                success: false,
                message: "Venue is already booked on this date.",
              };
          } else {
            const workspace = await prisma.workspace.findFirst({
              where: { name: { contains: resourceName } },
            });
            if (!workspace)
              return { success: false, message: "Workspace not found." };
            workspaceId = workspace.id;

            const existing = await prisma.reservation.findFirst({
              where: {
                workspaceId,
                reservationDate: new Date(date),
                status: { not: "Cancelled" },
              },
            });
            if (existing)
              return {
                success: false,
                message: "Workspace is already booked on this date.",
              };
          }

          const reservation = await prisma.reservation.create({
            data: {
              userId,
              venueId,
              workspaceId,
              reservationDate: new Date(date),
              startTime: startTime ?? null,
              endTime: endTime ?? null,
              status: "Confirmed",
            },
          });

          revalidateDashboard();

          return {
            success: true,
            reservationId: reservation.id,
            message: `Reservation RES-${reservation.id} confirmed successfully for ${date}.`,
          };
        },
      }),
      cancelReservation: tool({
        description: "Cancel a reservation by ID",
        inputSchema: jsonSchema<{
          reservationId: number;
        }>({
          type: "object",
          properties: {
            reservationId: { type: "number", description: "The numeric reservation ID" },
          },
          required: ["reservationId"],
          additionalProperties: false,
        }),
        execute: async ({ reservationId }) => {
          const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
          });
          if (!reservation)
            return { success: false, message: "Reservation not found." };

          if (reservation.userId !== userId && userRole !== "admin") {
            return {
              success: false,
              message: "Not authorized to cancel this reservation.",
            };
          }

          await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: "Cancelled" },
          });
          revalidateDashboard();
          return {
            success: true,
            message: `Reservation RES-${reservationId} has been cancelled successfully.`,
          };
        },
      }),
      updateReservation: tool({
        description:
          "Change the date and/or times of an existing reservation, identified by its numeric ID.",
        inputSchema: jsonSchema<{
          reservationId: number;
          date?: string;
          startTime?: string;
          endTime?: string;
        }>({
          type: "object",
          properties: {
            reservationId: { type: "number", description: "The numeric reservation ID" },
            date: { type: "string", description: "New ISO date string for the reservation" },
            startTime: { type: "string", description: "New start time of booking in 24h format (HH:MM)" },
            endTime: { type: "string", description: "New end time of booking in 24h format (HH:MM)" },
          },
          required: ["reservationId"],
          additionalProperties: false,
        }),
        execute: async ({ reservationId, date, startTime, endTime }) => {
          const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
          });
          if (!reservation)
            return { success: false, message: "Reservation not found." };

          if (reservation.userId !== userId && userRole !== "admin") {
            return {
              success: false,
              message: "Not authorized to modify this reservation.",
            };
          }

          // Ensure the same resource isn't already booked on the new date.
          const targetDate = date ? new Date(date) : reservation.reservationDate;

          if (date) {
            const clash = await prisma.reservation.findFirst({
              where: {
                id: { not: reservationId },
                venueId: reservation.venueId,
                workspaceId: reservation.workspaceId,
                reservationDate: targetDate,
                status: { not: "Cancelled" },
              },
            });
            if (clash)
              return {
                success: false,
                message: "That resource is already booked on the new date.",
              };
          }

          await prisma.reservation.update({
            where: { id: reservationId },
            data: {
              reservationDate: targetDate,
              startTime: startTime !== undefined ? startTime : reservation.startTime,
              endTime: endTime !== undefined ? endTime : reservation.endTime,
              status: "Confirmed",
            },
          });
          revalidateDashboard();
          return {
            success: true,
            message: `Reservation RES-${reservationId} has been updated successfully.`,
          };
        },
      }),
      listReservations: tool({
        description: "List the user's reservations",
        inputSchema: jsonSchema<Record<string, never>>({
          type: "object",
          properties: {},
          additionalProperties: false,
        }),
        execute: async () => {
          const reservations = await prisma.reservation.findMany({
            where: { userId },
            include: { venue: true, workspace: true },
            orderBy: { reservationDate: "desc" },
          });

          if (reservations.length === 0) {
            return { reservations: [], message: "No reservations found." };
          }

          return {
            reservations: reservations.map((r) => ({
              id: r.id,
              resource: r.venue?.name ?? r.workspace?.name,
              type: r.venue ? "venue" : "workspace",
              date: r.reservationDate.toISOString(),
              startTime: r.startTime,
              endTime: r.endTime,
              status: r.status,
            })),
            message: `Found ${reservations.length} reservation(s).`,
          };
        },
      }),
    },
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI request failed:", error);
    return Response.json(
      { message: "Failed to generate response" },
      { status: 500 },
    );
  }
}
