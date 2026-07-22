import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="rounded-sm border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-800 text-amber-400">
        {icon}
      </div>
      <h3 className="mb-2 text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
