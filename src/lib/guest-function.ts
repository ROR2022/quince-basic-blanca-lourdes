import { createServerFn } from "@tanstack/react-start";
import { resolveGuestById } from "@/server/guests";

export const resolveInvitationGuest = createServerFn({ method: "GET" })
  .validator((id: unknown) => (typeof id === "string" ? id : ""))
  .handler(async ({ data }) => resolveGuestById(data));
