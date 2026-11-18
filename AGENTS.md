<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

<!-- AGENT-MEMORY:BEGIN -->
- Invitation content (names, dates, venue, contacts) lives in `src/lib/config.ts`; sections in `src/components/invitation/` read from it — edit config, not components, for content changes. Why: single source of truth ported from the original Next.js repo.
- Web fonts load via Google Fonts `<link>` in `src/routes/__root.tsx` and map to `--font-*` tokens in `src/styles.css`. Why: Tailwind v4 cannot @import remote CSS.
- Shared decorative SVGs (roses, leaves, sparkles, floral divider) live in `src/components/invitation/ornaments.tsx`; reuse them instead of drawing new ones per section. Why: keeps the floral style consistent.
- The entry envelope calls `onOpen` on click (starts music inside the user gesture) and `onEnter` after its animation. Why: browsers block audio started outside a gesture.
<!-- AGENT-MEMORY:END -->
