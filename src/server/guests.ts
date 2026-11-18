import guestRecordsJson from "./data/invitados.json";

export interface GuestRecord {
  id: string;
  name: string;
  quantity: string;
  companionLimit: number | null;
  type: "personal" | "family" | "unlimited" | "pending";
  active: boolean;
  issue?: string;
  sourceLine?: number;
}

export interface PublicGuestInvitation {
  name: string;
  quantity: string;
  companionLimit: number | null;
}

export const GENERIC_GUEST: PublicGuestInvitation = {
  name: "Invitado",
  quantity: "1 persona",
  companionLimit: 0,
};

const guestRecords = guestRecordsJson as GuestRecord[];
const guestIdPattern = /^[A-Za-z0-9]{16}$/;

export function resolveGuestQuantity(quantity: unknown): {
  quantity: string;
  companionLimit: number | null;
} | null {
  if (typeof quantity !== "string") return null;

  const normalized = quantity.trim().toLocaleLowerCase("es-MX");
  if (normalized === "personal") {
    return { quantity: "personal", companionLimit: 0 };
  }
  if (normalized === "ilimitado") {
    return { quantity: "ilimitado", companionLimit: null };
  }

  const match = /^(\d+)\s+personas?$/.exec(normalized);
  if (!match) return null;

  const total = Number(match[1]);
  if (!Number.isSafeInteger(total) || total < 1) return null;

  return {
    quantity: `${total} ${total === 1 ? "persona" : "personas"}`,
    companionLimit: Math.max(0, total - 1),
  };
}

export function resolveGuestById(id: unknown): PublicGuestInvitation {
  if (typeof id !== "string" || !guestIdPattern.test(id)) {
    return GENERIC_GUEST;
  }

  const record = guestRecords.find((guest) => guest.active && guest.id === id);
  if (!record) return GENERIC_GUEST;

  const quantity = resolveGuestQuantity(record.quantity);
  if (
    !record.name.trim() ||
    !quantity ||
    (record.companionLimit !== null && record.companionLimit !== quantity.companionLimit)
  ) {
    return GENERIC_GUEST;
  }

  return {
    name: record.name,
    quantity: quantity.quantity,
    companionLimit: quantity.companionLimit,
  };
}
