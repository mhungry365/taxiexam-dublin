import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dashboardStats, examModules, planWeeks, quizModes, weakCategories } from "@/lib/taxipass-data";

export default function HomePage() {
  return (
    <>
      <section className="bg-snow">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-muted-foreground">
              <CalendarCheck size={16} className="text-teal" aria-hidden />
              4-week Dublin SPSV preparation plan
            </div>
            <h1 className="mt-6 text-5xl font-black leading-[1.02] text-navy md:text-7xl">
              Taxi theory prep that gets you test-ready.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              TaxiPass Dublin combines smart quizzes, spaced repetition, weak-question review, progress tracking, and full mock exams for the SPSV / Taxi Driver Entry Test.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Start your 4-week plan <ArrowRight size={18} aria-hidden /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/mock-exam">Preview mock exam</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-navy sm:grid-cols-3">
              {["75% pass mark each module", "Train to 85%+ before booking", "Daily review adapts to mistakes"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-teal" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Card className="p-5 shadow-soft">
            <div className="rounded-lg bg-navy p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Mock readiness</p>
                  <p className="text-4xl font-black">71%</p>
                </div>
                <BadgeCheck className="text-gold" size={42} aria-hidden />
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[71%] rounded-full bg-gold" />
              </div>
              <p className="mt-3 text-sm text-white/70">Keep practising until both modules are consistently 85%+.</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {dashboardStats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-border bg-snow p-4">
                  <Icon className="text-teal" size={20} aria-hidden />
                  <p className="mt-3 text-sm text-muted-foreground">{label}</p>
                  <p className="text-xl font-black text-navy">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-2">
            {examModules.map((module) => (
              <Card key={module.key} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase text-teal">{module.name}</p>
                    <h2 className="mt-2 text-3xl font-black text-navy">{module.questions} questions</h2>
                  </div>
                  <ClipboardCheck className="text-coral" size={32} aria-hidden />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Pass mark</p>
                    <p className="text-2xl font-black">{module.target}%</p>
                  </div>
                  <div className="rounded-md bg-cream p-4">
                    <p className="text-sm text-muted-foreground">Recommended booking level</p>
                    <p className="text-2xl font-black">{module.ready}%+</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-snow">
        <div className="container">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-bold text-teal">Your four-week plan</p>
              <h2 className="mt-2 text-4xl font-black text-navy">Small daily wins, real exam confidence.</h2>
            </div>
            <Button asChild variant="outline"><Link href="/dashboard">Open dashboard</Link></Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {planWeeks.map((week) => (
              <Card key={week.week} className="p-5">
                <p className="text-sm font-bold text-coral">{week.week}</p>
                <h3 className="mt-2 text-xl font-black text-navy">{week.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{week.focus}</p>
                <p className="mt-4 text-sm font-bold">{week.target}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${week.progress}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-bold text-teal">Smart practice</p>
            <h2 className="mt-2 text-4xl font-black text-navy">Six quiz modes keep revision moving.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Wrong answers appear more often, known questions fade back, and every question builds a confidence score.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {weakCategories.map((category) => (
                <span key={category} className="rounded-md bg-cream px-3 py-2 text-sm font-bold text-navy">{category}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quizModes.map(({ name, icon: Icon, detail }) => (
              <Card key={name} className="p-5">
                <Icon className="text-teal" size={24} aria-hidden />
                <h3 className="mt-4 font-black text-navy">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy text-white">
        <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <Timer size={20} aria-hidden />
              <p className="font-bold">Full timed mock exam</p>
            </div>
            <h2 className="mt-3 text-4xl font-black">54 industry + 36 Dublin Area questions.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/75">Separate module scores, pass/fail status, wrong-answer review, and a readiness score that nudges you toward 85%+ before booking the real test.</p>
          </div>
          <Button asChild size="lg"><Link href="/mock-exam">Try a mock</Link></Button>
        </div>
      </section>
    </>
  );
}
