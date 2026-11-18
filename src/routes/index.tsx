import { createFileRoute } from "@tanstack/react-router";
import { InvitationExperience } from "@/components/invitation/invitation-experience";
import { resolveInvitationGuest } from "@/lib/guest-function";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: ({ deps }) => resolveInvitationGuest({ data: deps.id ?? "" }),
  head: () => ({
    meta: [
      { title: "Mis XV años de Blanca Lourdes" },
      {
        name: "description",
        content: "Acompaña a Blanca Lourdes a celebrar sus XV años el 18 de diciembre de 2026.",
      },
      { property: "og:title", content: "Mis XV años de Blanca Lourdes" },
      {
        property: "og:description",
        content: "Acompaña a Blanca Lourdes a celebrar sus XV años el 18 de diciembre de 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const guest = Route.useLoaderData();
  return <InvitationExperience guest={guest} />;
}
