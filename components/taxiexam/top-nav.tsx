import Link from "next/link";
import { CarTaxiFront, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  ["Plan", "/dashboard"],
  ["Quiz", "/quiz"],
  ["Practice", "/practice"],
  ["Mock", "/mock-exam"],
  ["Dublin", "/dublin-area"],
  ["Admin", "/admin"],
  ["Question Bank", "/question-bank"],
  ["Fares", "/practice/fares"],
  ["Driver Licensing", "/practice/driver-licensing"],
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy">
          <span className="grid size-9 place-items-center rounded-md bg-teal text-white">
            <CarTaxiFront size={20} aria-hidden />
          </span>
          <span>TaxiExam Dublin</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-navy">
              {label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/login"><LogIn size={16} aria-hidden /> Login</Link>
        </Button>
      </div>
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container flex flex-col gap-3 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>TaxiExam Dublin prepares learners with original practice content and progress tools.</p>
        <p>Sample app content is not official NTA exam material.</p>
      </div>
    </footer>
  );
}
