export const invitationConfig = {
  quinceanera: {
    name: "Blanca Lourdes",
    shortName: "Blanca",
    phrase:
      "Hija mía, no te olvides de mi enseñanza, y tu corazón guarde mis mandamientos; porque largura de días y años de vida y paz te aumentarán.",
    verseReference: "Proverbios 3:1-2",
  },
  event: {
    date: "2026-12-18T20:00:00-06:00",
    timeZone: "America/Mexico_City",
    arrivalTime: "19:00",
    startTime: "20:00",
    dressCode: "Formal",
    reservedColorMessage: "El color rosa está reservado para la quinceañera.",
    rsvpDeadline: "2026-12-08",
  },
  parents: {
    first: "Mtro. Stalin Pérez De los Santos",
    second: "Lic. Verónica del Carmen Gómez Garduza",
  } as const,
  godparents: {
    godmother: "Mtro. Mario Pérez Pérez",
    godfather: "Sra. María Elsy De los Santos León",
  },
  reception: {
    name: "Palapa Roger",
    address: "86599, Av. Frontera 37, Secc 40, Cárdenas, Tab.",
    mapsUrl: "https://maps.app.goo.gl/Dz8tjQkqUs7Ssb1j9",
  },
  gifts: {
    title: "Buzón de sueños",
    message: "Esta noche será aún más especial con su presencia.",
    instructions: "Si desea hacerme un presente, puede dejar su sobre en mi buzón de sueños.",
  },
  contact: {
    // Contacto comercial del proveedor, independiente del RSVP familiar.
    whatsapp: "5217777937484",
    quoteMessage: "Hola, me interesa contratar una invitación digital para mi evento.",
  },
  confirmationWhatsappNumber: "529371219114",
  familyMessage: "Agradezco de corazón su compañía en esta noche tan especial.",
} as const;

export type InvitationConfig = typeof invitationConfig;

/** Paleta sugerida para invitados (sin rosa). */
export const guestColorPalette = [
  { name: "Verde esmeralda", hex: "#1f7a5a" },
  { name: "Verde salvia", hex: "#9caf88" },
  { name: "Azul marino", hex: "#1b2a4a" },
  { name: "Azul cielo", hex: "#8fb8d6" },
  { name: "Lavanda", hex: "#c8b9db" },
  { name: "Lila", hex: "#a99bbe" },
  { name: "Champagne", hex: "#e8d7b5" },
  { name: "Beige", hex: "#d9cbb2" },
  { name: "Negro", hex: "#1a1a1a" },
] as const;
