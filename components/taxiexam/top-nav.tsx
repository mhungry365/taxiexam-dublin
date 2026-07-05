import Link from "next/link";
import { CarFront } from "lucide-react";

const mainLinks = [
  ["Plan", "/dashboard"],
  ["Practice", "/practice"],
  ["Mock", "/mock-exam"],
  ["Dublin", "/dublin-area"],
];

const moreLinks = [
  ["Question Bank", "/question-bank"],
  ["Quiz", "/quiz"],
  ["Admin", "/admin"],
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-black text-navy">
          <span className="grid size-10 place-items-center rounded-lg bg-teal text-white">
            <CarFront className="size-5" />
          </span>
          <span>TaxiExam Dublin</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {mainLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-navy"
            >
              {label}
            </Link>
          ))}

          <div className="group relative">
            <button className="rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-navy">
              More
            </button>
            <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {moreLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-navy"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <Link
          href="/login"
          className="rounded-lg bg-teal px-4 py-3 text-sm font-black text-white hover:bg-teal/90"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
