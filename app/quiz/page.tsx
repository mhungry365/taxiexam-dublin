import { Brain, CalendarDays, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { QuizRunner } from "@/components/taxipass/quiz-runner";
import { quizModes } from "@/lib/taxipass-data";

export const metadata = {
  title: "Quiz"
};

export default function QuizPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-bold text-teal">Practice engine</p>
            <h1 className="mt-2 text-4xl font-black text-navy">Learn, review, and strengthen weak questions.</h1>
            <p className="mt-4 leading-7 text-muted-foreground">
              The production question selector should weight items by due date, confidence, recent mistakes, and module coverage. This demo uses original sample questions.
            </p>
            <div className="mt-6 grid gap-3">
              <Card className="p-4">
                <Brain className="text-teal" aria-hidden />
                <p className="mt-3 font-black text-navy">Spaced repetition</p>
                <p className="text-sm text-muted-foreground">Wrong answers become due sooner. Confident answers move further out.</p>
              </Card>
              <Card className="p-4">
                <CalendarDays className="text-coral" aria-hidden />
                <p className="mt-3 font-black text-navy">Daily review</p>
                <p className="text-sm text-muted-foreground">A focused set of due questions keeps the four-week plan realistic.</p>
              </Card>
              <Card className="p-4">
                <Gauge className="text-gold" aria-hidden />
                <p className="mt-3 font-black text-navy">Quick 10</p>
                <p className="text-sm text-muted-foreground">Short sessions for commuting, breaks, or last-minute refreshers.</p>
              </Card>
            </div>
          </div>
          <QuizRunner title="Quick practice" />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {quizModes.map(({ name, detail, icon: Icon }) => (
            <Card key={name} className="p-5">
              <Icon className="text-teal" aria-hidden />
              <h2 className="mt-4 font-black text-navy">{name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
