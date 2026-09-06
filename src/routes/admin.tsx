import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Console — NUT Eti-Osa COOP" },
      {
        name: "description",
        content:
          "Secretariat sign-in for NUT Eti-Osa COOP: members register, savings and Oracle deductions, loans, commodity orders and reports.",
      },
      { property: "og:title", content: "Staff Console — NUT Eti-Osa COOP" },
      {
        property: "og:description",
        content:
          "Manage members, savings, loans, commodity orders and reports for NUT Eti-Osa Cooperative.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/app/index.html?portal=admin" });
  },
  component: () => null,
});
