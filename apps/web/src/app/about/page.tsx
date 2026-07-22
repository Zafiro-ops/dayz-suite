import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "DAYZ SUITE is an independent community project providing free interactive maps and survival tools for DayZ players worldwide.",
};

export default function AboutPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-2xl">
          <h1 className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            About DAYZ SUITE
          </h1>

          <div className="space-y-5 text-sm leading-relaxed text-zinc-400">
            <p>
              DAYZ SUITE is an independent community project built by DayZ
              players, for DayZ players. Our goal is to provide free, fast, and
              genuinely useful tools that help survivors navigate the world
              without slowing down their game.
            </p>
            <p>
              We started with interactive maps because they are the most
              universally needed resource — whether you are a new survivor
              trying to find your bearings or a seasoned player planning a
              coordinated loot run.
            </p>
            <p>
              DAYZ SUITE is not affiliated with, endorsed by, or connected to
              Bohemia Interactive in any way. DayZ is a registered trademark of
              Bohemia Interactive. All game assets, names, and trademarks remain
              the property of their respective owners.
            </p>
            <p>
              This project is maintained independently and is free to use. If
              you find it useful, consider supporting it to help keep the maps
              updated and the servers running.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
