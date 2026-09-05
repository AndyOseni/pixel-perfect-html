import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/member")({
  head: () => ({
    meta: [
      { title: "Member Portal — NUT Eti-Osa COOP" },
      {
        name: "description",
        content:
          "Members sign in to view savings, loan eligibility, commodity requests and messages with the NUT Eti-Osa trustees.",
      },
      { property: "og:title", content: "Member Portal — NUT Eti-Osa COOP" },
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
