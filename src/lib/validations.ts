import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const reservationSchema = z.object({
  venueId: z.number().int().positive().optional(),
  workspaceId: z.number().int().positive().optional(),
  reservationDate: z.string().datetime("Invalid date format"),
  startTime: z.string().min(1, "Start time is required").optional().nullable(),
  endTime: z.string().min(1, "End time is required").optional().nullable(),
}).refine((data) => data.venueId || data.workspaceId, {
  message: "Either venueId or workspaceId is required",
});

export const cancelReservationSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid reservation ID"),
});

export const updateReservationSchema = z.object({
  reservationDate: z.string().datetime("Invalid date format"),
  startTime: z.string().min(1, "Start time is required").optional().nullable(),
  endTime: z.string().min(1, "End time is required").optional().nullable(),
});

export const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional().default(""),
  capacity: z.number().int().positive("Capacity must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional().default(""),
  capacity: z.number().int().positive("Capacity must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
});

export const chatMessageSchema = z.object({
  messages: z.array(z.object({
    id: z.string(),
    role: z.enum(["user", "assistant", "system", "tool"]),
    content: z.string(),
    toolInvocations: z.array(z.object({
      toolCallId: z.string(),
      toolName: z.string(),
      args: z.record(z.string(), z.unknown()),
      state: z.enum(["calling", "result"]),
      result: z.unknown().optional(),
    })).optional(),
  })),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;
export type VenueInput = z.infer<typeof venueSchema>;
export type WorkspaceInput = z.infer<typeof workspaceSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;