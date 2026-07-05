import Link from "next/link";
import { ArrowRight, Flame, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dashboardStats, planWeeks, weakCategories } from "@/lib/taxipass-data";

export const metadata = {
  title: "Dashboard"
};

export default function DashboardPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold text-teal">Learner dashboard</p>
            <h1 className="mt-2 text-4xl font-black text-navy">Today&apos;s SPSV study plan</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Complete 30 questions, review weak categories, and keep your mock readiness moving toward 85%+.</p>
          </div>
          <Button asChild><Link href="/quiz">Start daily review <ArrowRight size={18} /></Link></Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {dashboardStats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="p-5">
              <Icon className="text-teal" aria-hidden />
              <p className="mt-4 text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-black text-navy">{value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Target className="text-coral" aria-hidden />
              <h2 className="text-2xl font-black text-navy">4-week study plan</h2>
            </div>
            <div className="mt-6 grid gap-4">
              {planWeeks.map((week) => (
                <div key={week.week} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[120px_1fr_110px] md:items-center">
                  <p className="font-black text-teal">{week.week}</p>
                  <div>
                    <p className="font-bold text-navy">{week.title}</p>
                    <p className="text-sm text-muted-foreground">{week.focus}</p>
                  </div>
                  <p className="text-sm font-bold">{week.target}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Flame className="text-coral" aria-hidden />
                <h2 className="text-2xl font-black text-navy">Weak categories</h2>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {weakCategories.map((category) => (
                  <span key={category} className="rounded-md bg-cream px-3 py-2 text-sm font-bold">{category}</span>
                ))}
              </div>
            </Card>
            <Card className="bg-navy p-6 text-white">
              <p className="text-sm text-white/70">Mock exam readiness</p>
              <p className="mt-2 text-5xl font-black">71%</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[71%] rounded-full bg-gold" />
              </div>
              <p className="mt-4 text-sm text-white/75">Book the real test when you can repeat 85%+ in both modules.</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
