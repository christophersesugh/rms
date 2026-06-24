import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),
  OPENAI_API_KEY: z.string().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([key, value]) => `  ${key}: ${value?.join(", ")}`)
      .join("\n");

    throw new Error(
      `\n❌ Invalid environment variables:\n${message}\n\nCheck your .env file. See .env.example for required variables.\n`
    );
  }

  return parsed.data;
}

export const env = validateEnv();
