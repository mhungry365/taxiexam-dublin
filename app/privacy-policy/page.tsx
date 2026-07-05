import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for TaxiPass Dublin."
};

export default function PrivacyPage() {
  return (
    <section className="section bg-snow">
      <div className="container max-w-3xl">
        <Card className="p-8">
          <h1 className="text-4xl font-black text-navy">Privacy Policy</h1>
          <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
            <p>TaxiPass Dublin stores account, quiz, study-plan, and progress data so learners can track preparation for the Dublin SPSV / Taxi Driver Entry Test.</p>
            <p>Authentication and user data are managed with Supabase. Payment details are not collected by this app template.</p>
            <p>Question responses may be used to calculate readiness, spaced repetition due dates, weak categories, and mock exam history.</p>
            <p>Users can request access, correction, or deletion of their personal data by contacting the app operator.</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
