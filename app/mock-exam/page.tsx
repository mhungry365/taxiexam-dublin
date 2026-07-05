import { AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizRunner } from "@/components/taxipass/quiz-runner";
import { examModules, sampleQuestions } from "@/lib/taxipass-data";

export const metadata = {
  title: "Mock Exam"
};

export default function MockExamPage() {
  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 font-bold text-teal">
              <Timer aria-hidden />
              Full timed exam mode
            </div>
            <h1 className="mt-3 text-4xl font-black text-navy">Separate pass/fail scoring for both modules.</h1>
            <p className="mt-4 leading-7 text-muted-foreground">
              A production mock pulls 54 active Industry Knowledge questions and 36 active Dublin Area Knowledge questions, records every answer, and unlocks wrong-answer review at the end.
            </p>
            <div className="mt-6 grid gap-4">
              {examModules.map((module) => (
                <Card key={module.key} className="p-5">
                  <p className="font-black text-navy">{module.name}</p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-md bg-muted p-3"><b>{module.questions}</b><br />questions</div>
                    <div className="rounded-md bg-muted p-3"><b>{module.target}%</b><br />pass</div>
                    <div className="rounded-md bg-cream p-3"><b>{module.ready}%+</b><br />ready</div>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-6 p-5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-coral" aria-hidden />
                <p className="font-black text-navy">Result logic</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Users pass only when they score at least 75% in each module. The app still recommends waiting until 85%+ is repeatable.</p>
            </Card>
          </div>
          <div>
            <Card className="mb-5 bg-navy p-5 text-white">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-gold" aria-hidden />
                <div>
                  <p className="font-black">Demo mock preview</p>
                  <p className="text-sm text-white/70">Sample questions only; add your licensed or original bank in Supabase.</p>
                </div>
              </div>
            </Card>
            <QuizRunner title="Mock exam sample" questions={sampleQuestions} />
            <Button className="mt-5 w-full" variant="outline">Review wrong answers</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
