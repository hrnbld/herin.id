import { createMcpHandler } from "mcp-handler";
import {
  profile,
  trackRecord,
  experience,
  services,
  demos,
  faqs,
} from "@/lib/profile";

// Read-only MCP server exposing the site's profile data to AI agents.
// Streamable HTTP endpoint: /api/mcp (SSE transport is intentionally not
// configured — no Redis on this deployment).

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "get_profile",
      "Who Herin Yudha Pratama is: role, positioning, summary, commercial track record, and contact details.",
      {},
      async () => json({ ...profile, trackRecord }),
    );
    server.tool(
      "get_experience",
      "Herin's work history — roles, companies, periods, and what he led at each.",
      {},
      async () => json(experience),
    );
    server.tool(
      "get_services",
      "Services Herin offers: AI automation & agent orchestration, full-stack development, ERP & accounting systems, WhatsApp commerce, performance marketing, dashboards.",
      {},
      async () => json(services),
    );
    server.tool(
      "get_demos",
      "Live product demos on herin.id — a double-entry ERP and a WhatsApp commerce system, both real software with safe dummy data.",
      {},
      async () => json(demos),
    );
    server.tool(
      "get_faq",
      "Frequently asked questions about working with Herin: what he builds, how engagements run, and where he's based.",
      {},
      async () => json(faqs),
    );
  },
  { serverInfo: { name: "herin-id", version: "1.0.0" } },
  { basePath: "/api", maxDuration: 60 },
);

export { handler as GET, handler as POST, handler as DELETE };
