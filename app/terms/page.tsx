import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for TaxiExam Dublin."
};

export default function TermsPage() {
  return (
    <section className="section bg-snow">
      <div className="container max-w-3xl">
        <Card className="p-8">
          <h1 className="text-4xl font-black text-navy">Terms</h1>
          <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
            <p>TaxiExam Dublin provides revision tools, progress tracking, and original sample practice content for SPSV test preparation.</p>
            <p>The app is not an official National Transport Authority product and does not guarantee a test pass.</p>
            <p>Learners should verify current requirements, fees, booking rules, and test guidance with official sources before booking the real exam.</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
