import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const guestsFile = path.join(root, "src", "server", "data", "invitados.json");
const outputFile = path.join(root, "private", "enlaces-invitados.txt");
const baseUrl =
  process.env.INVITATION_BASE_URL ?? "https://quince-basic-blanca-lourdes.vercel.app/";

const guests = JSON.parse(fs.readFileSync(guestsFile, "utf8"));
const idPattern = /^[A-Za-z0-9]{16}$/;
const activeGuests = guests.filter(
  (guest) =>
    guest.active &&
    typeof guest.id === "string" &&
    idPattern.test(guest.id) &&
    typeof guest.name === "string" &&
    guest.name.trim() &&
    typeof guest.quantity === "string" &&
    guest.quantity.trim(),
);

const origin = baseUrl.replace(/\/+$/, "");
const lines = activeGuests.flatMap((guest) => [
  `${origin}/?id=${guest.id}`,
  `${guest.name} ${guest.quantity}`,
  "",
]);

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${lines.join("\n").trimEnd()}\n`, "utf8");

console.log(`Exportados ${activeGuests.length} enlaces privados.`);
