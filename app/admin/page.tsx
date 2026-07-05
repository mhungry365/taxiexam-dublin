import { Download, FileJson, Plus, Search, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sampleQuestions } from "@/lib/taxipass-data";

export const metadata = {
  title: "Admin"
};

export default function AdminPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold text-teal">Admin dashboard</p>
            <h1 className="mt-2 text-4xl font-black text-navy">Manage the TaxiPass question bank.</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Add, edit, delete, activate, import, and review questions and categories. Production access is protected by the admin role in Supabase RLS.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><FileJson size={16} aria-hidden /> Import</Button>
            <Button><Plus size={16} aria-hidden /> New question</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-6">
            <h2 className="text-2xl font-black text-navy">Question editor</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Category
                <Input placeholder="Hospitals" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Subcategory
                <Input placeholder="Major hospitals" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Module type
                <select className="h-11 rounded-md border border-input bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option>industry</option>
                  <option>dublin_area</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Question text
                <textarea className="min-h-28 rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Write original question text..." />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {["A", "B", "C", "D"].map((label) => (
                  <label key={label} className="grid gap-2 text-sm font-semibold">
                    Option {label}
                    <Input placeholder={`Answer ${label}`} />
                  </label>
                ))}
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Explanation
                <textarea className="min-h-24 rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </label>
              <Button>Save question</Button>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-3 text-muted-foreground" size={16} aria-hidden />
                  <Input className="pl-9" placeholder="Search all questions" />
                </div>
                <Button variant="outline"><Download size={16} aria-hidden /> Export JSON</Button>
              </div>
            </Card>

            <div className="grid gap-4">
              {sampleQuestions.map((question) => (
                <Card key={question.id} className="p-5">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">{question.module}</span>
                        <span className="rounded-md bg-cream px-2 py-1 text-xs font-bold">{question.category}</span>
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-bold">{question.difficulty}</span>
                      </div>
                      <h2 className="mt-3 font-black text-navy">{question.question}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{question.explanation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline"><ToggleLeft size={16} aria-hidden /> Active</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
