import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NUT Eti-Osa COOP — Member Portal" },
      {
        name: "description",
        content:
          "Members sign in to view savings, loan eligibility, commodity requests and messages with the NUT Eti-Osa trustees.",
      },
      { property: "og:title", content: "NUT Eti-Osa COOP — Member Portal" },
      {
        property: "og:description",
        content:
          "Check your savings, loan eligibility, commodity requests and trustee messages in the NUT Eti-Osa member portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/app/index.html?portal=member" });
  },

  component: () => null,
});
