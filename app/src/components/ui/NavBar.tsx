"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavVisibility } from "@/lib/nav-context";

const TABS = [
  { href: "/today", label: "Today" },
  { href: "/journey", label: "Journey" },
  { href: "/insights", label: "Insights" },
  { href: "/reviews", label: "Reviews" },
  { href: "/settings", label: "Settings" },
] as const;

export function NavBar() {
  const { hidden } = useNavVisibility();
  const pathname = usePathname();

  if (hidden || pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/today" className="text-sm font-semibold tracking-wide text-text">
          GRINDSTONE
        </Link>
        <nav className="flex gap-1">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-surface-2 text-text"
                    : "text-text-dim hover:text-text"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
