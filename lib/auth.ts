import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type SessionMetadata = { role?: string };

function getRole(sessionClaims: unknown): string | undefined {
  const claims = sessionClaims as Record<string, unknown> | null | undefined;
  const meta = claims?.publicMetadata as SessionMetadata | undefined;
  return meta?.role;
}

export async function requireAdminPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");
  if (getRole(sessionClaims) !== "admin") redirect("/unauthorized");
}
