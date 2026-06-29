import { revalidatePath } from "next/cache";

export function revalidateAll() {
  for (const path of [
    "/dashboard",
    "/reservations",
    "/venues",
    "/workspaces",
    "/admin",
    "/admin/users",
  ]) {
    revalidatePath(path);
  }
}
