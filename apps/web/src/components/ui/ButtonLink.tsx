import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
  const variants: Record<string, string> = {
    primary: "bg-amber-500 text-zinc-950 hover:bg-amber-400",
    secondary:
      "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
  };

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Link>
  );
}
