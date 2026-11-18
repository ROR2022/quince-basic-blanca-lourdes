import { describe, expect, it } from "vitest";
import { GENERIC_GUEST, resolveGuestById, resolveGuestQuantity } from "@/server/guests";

describe("guest quantity resolution", () => {
  it("treats personal invitations as one pass without companions", () => {
    expect(resolveGuestQuantity(" personal ")).toEqual({
      quantity: "personal",
      companionLimit: 0,
    });
  });

  it("calculates companions from fixed passes", () => {
    expect(resolveGuestQuantity("1 persona")).toEqual({
      quantity: "1 persona",
      companionLimit: 0,
    });
    expect(resolveGuestQuantity("2 personas")).toEqual({
      quantity: "2 personas",
      companionLimit: 1,
    });
  });

  it("supports unlimited invitations", () => {
    expect(resolveGuestQuantity("ILIMITADO")).toEqual({
      quantity: "ilimitado",
      companionLimit: null,
    });
  });

  it.each(["", "0 personas", "-2 personas", "2personas", "dos personas", "2.5 personas"])(
    "rejects invalid quantity %s",
    (quantity) => {
      expect(resolveGuestQuantity(quantity)).toBeNull();
    },
  );
});

describe("guest id resolution", () => {
  it("rejects invalid id formats", () => {
    expect(resolveGuestById("short")).toEqual(GENERIC_GUEST);
    expect(resolveGuestById("123456789012345-")).toEqual(GENERIC_GUEST);
    expect(resolveGuestById("á234567890123456")).toEqual(GENERIC_GUEST);
  });

  it("does not expose a catalog for an unknown id", () => {
    expect(resolveGuestById("AbCdEfGh12345678")).toEqual(GENERIC_GUEST);
  });

  it("ignores non-string ids", () => {
    expect(resolveGuestById(null)).toEqual(GENERIC_GUEST);
    expect(resolveGuestById(undefined)).toEqual(GENERIC_GUEST);
  });

  it("resolves the open family pass with a maximum of 10 attendees", () => {
    expect(resolveGuestById("WwIX4pMjEPYoCXaZ")).toEqual({
      name: "Familiar",
      quantity: "ilimitado",
      companionLimit: null,
      maxAttendees: 10,
    });
  });
});
