import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const personalSource = path.join(root, "invitados01.txt");
const familySource = path.join(root, "invitados02.txt");
const outputDir = path.join(root, "src", "server", "data");
const outputFile = path.join(outputDir, "invitados.json");
const duplicateFile = path.join(outputDir, "duplicados.json");

const invisibleChars = /[\u200B-\u200D\u2060\uFEFF]/g;
const orderPrefix = /^\s*(?:\d+\.\s*|\d+\s*-\s*)/;
const quantityPattern =
  /^(.*?)\s*\(\s*(\d+)\s*personas?\s*\)\s*$|^(.*?)\s*(\d+)\s*personas?\s*$|^(.*?)\s*-\s*(\d+)\s*$|^(.*?)\s*\((\d+)\s*\)\s*$/i;

function cleanText(value) {
  return value
    .replace(invisibleChars, "")
    .replace(orderPrefix, "")
    .replace(/\s+/g, " ")
    .replace(/^[\s,.:;-]+|[\s,.:;-]+$/g, "")
    .trim();
}

function createId(existing) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id;

  do {
    const bytes = crypto.randomBytes(16);
    id = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  } while (existing.has(id));

  existing.add(id);
  return id;
}

function parsePersonalLines(text) {
  return text
    .split(/\r?\n/)
    .slice(1)
    .map(cleanText)
    .filter(Boolean)
    .map((name) => ({ name, quantity: "personal", companionLimit: 0, type: "personal" }));
}

function parseFamilyLines(text) {
  return text
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cleaned = cleanText(line);
      const normalized = cleaned
        .replace(/(\d)\s*personas?/gi, "$1 personas")
        .replace(/sro\./gi, "Sro.")
        .replace(/prof\./gi, "Prof.")
        .replace(/doc\./gi, "Doc.")
        .replace(/sra\./gi, "Sra.");

      let name = normalized;
      let quantity = "";
      let total = null;
      let issue = null;

      const match = quantityPattern.exec(normalized);
      if (match) {
        const captures = match.slice(1).filter((value) => value !== undefined);
        const numeric = captures.find((value) => /^\d+$/.test(value));
        const textName = captures.find((value) => !/^\d+$/.test(value));
        if (numeric) {
          total = Number(numeric);
          name = cleanText(textName || "");
          quantity = `${total} personas`;
        }
      }

      if (!quantity) {
        const inline = normalized.match(/^(.*?)\s*\b(\d+)\s*personas?\b/i);
        if (inline) {
          name = cleanText(inline[1]);
          total = Number(inline[2]);
          quantity = `${total} ${total === 1 ? "persona" : "personas"}`;
        }
      }

      if (total === null) {
        issue = "No se pudo reconocer la cantidad";
      } else if (!Number.isSafeInteger(total) || total < 1) {
        issue = "La cantidad no es válida";
      } else if (!name) {
        issue = "No se pudo reconocer el nombre";
      }

      return {
        name,
        quantity,
        companionLimit: issue ? null : Math.max(0, total - 1),
        type: issue ? "pending" : "family",
        sourceLine: index + 2,
        issue,
        raw: cleaned,
      };
    });
}

const personal = parsePersonalLines(fs.readFileSync(personalSource, "utf8"));
const family = parseFamilyLines(fs.readFileSync(familySource, "utf8"));
const records = [...personal, ...family];
const ids = new Set();

const previousGuests = fs.existsSync(outputFile)
  ? JSON.parse(fs.readFileSync(outputFile, "utf8"))
  : [];
const previousPersonal = previousGuests.filter((guest) => guest.type === "personal");
const previousFamily = previousGuests.filter((guest) => guest.type === "family");

const guests = records.map((record, recordIndex) => {
  let previous;
  if (record.type === "personal") {
    const personalIndex = recordIndex;
    previous = previousPersonal[personalIndex];
  } else if (record.type === "family") {
    previous = previousFamily.find((guest) => guest.sourceLine === record.sourceLine);
  }

  const id = previous && /^[A-Za-z0-9]{16}$/.test(previous.id) ? previous.id : createId(ids);

  if (/^[A-Za-z0-9]{16}$/.test(id)) {
    ids.add(id);
  }

  return {
    id,
    name: record.name,
    quantity: record.quantity,
    companionLimit: record.companionLimit,
    type: record.type,
    active: record.issue == null,
    issue: record.issue || undefined,
    sourceLine: record.sourceLine,
  };
});

const duplicateCounts = new Map();
for (const guest of personal) {
  const key = guest.name.toLocaleLowerCase("es-MX");
  duplicateCounts.set(key, (duplicateCounts.get(key) || 0) + 1);
}

const duplicates = [...duplicateCounts.entries()]
  .filter(([, count]) => count > 1)
  .map(([normalizedName, count]) => {
    const record = personal.find(
      (guest) => guest.name.toLocaleLowerCase("es-MX") === normalizedName,
    );
    return { name: record.name, count };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "es-MX"));

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(guests, null, 2)}\n`, "utf8");
fs.writeFileSync(
  duplicateFile,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), duplicates }, null, 2)}\n`,
  "utf8",
);

const active = guests.filter((guest) => guest.active).length;
const pending = guests.filter((guest) => !guest.active);
console.log(
  `Generados ${guests.length} registros: ${active} activos, ${pending.length} pendientes.`,
);
console.log(`Nombres repetidos detectados: ${duplicates.length}.`);
