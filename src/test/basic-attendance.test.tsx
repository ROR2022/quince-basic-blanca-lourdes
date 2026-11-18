import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BasicAttendance } from "@/components/invitation/basic-attendance";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

describe("BasicAttendance guest name", () => {
  it("prefills and locks the name associated with the invitation", () => {
    render(<BasicAttendance companionLimit={0} guestName="Invitado de ejemplo" />);

    const nameInput = screen.getByRole("textbox", {
      name: "Nombre completo",
    });

    expect(nameInput).toHaveValue("Invitado de ejemplo");
    expect(nameInput).toHaveAttribute("readonly");
  });
});
