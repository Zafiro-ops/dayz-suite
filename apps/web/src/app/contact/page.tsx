import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the DAYZ SUITE team. We welcome feedback, bug reports, and community contributions.",
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-xl">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact
          </h1>
          <p className="mb-10 text-sm leading-relaxed text-zinc-400">
            Have feedback, found a bug, or want to contribute? We would love to
            hear from you.
          </p>

          <div className="rounded-sm border border-zinc-800 bg-zinc-900 p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email
            </p>
            <a
              href="mailto:contact@dayzsuite.com"
              className="text-sm text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
            >
              contact@dayzsuite.com
            </a>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              We typically respond within a few days. This project is maintained
              by a small independent team.
            </p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-zinc-500">
            For bug reports, please include your browser, device type, and a
            short description of what happened.
          </p>
        </div>
      </Container>
    </section>
  );
}
