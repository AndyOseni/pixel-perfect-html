import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NUT Eti-Osa COOP" },
      {
        name: "description",
        content:
          "NUT Eti-Osa Cooperative portal for members, savings, loans and commodity orders.",
      },
      { property: "og:title", content: "NUT Eti-Osa COOP" },
      {
        property: "og:description",
        content:
          "Manage cooperative members, savings, loans and commodity orders for NUT Eti-Osa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/app/index.html" });
  },
  component: () => null,
});
