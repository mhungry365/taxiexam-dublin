import Link from "next/link";
import { Clock3, Layers3, ListChecks, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MixedMockEngine } from "@/components/taxiexam/mock/mixed-mock-engine";

type MockLength = 25 | 40 | 60 | "all";

function parseMockLength(value?: string): MockLength | null {
  if (value === "25") return 25;
  if (value === "40") return 40;
  if (value === "60") return 60;
  if (value === "all") return "all";

  return null;
}

export default async function MockExamPage({
  searchParams
}: {
  searchParams: Promise<{ size?: string }>;
}) {
  const { size } = await searchParams;
  const mockLength = parseMockLength(size);

  if (!mockLength) {
    return (
      <section className="section bg-snow">
        <div className="container">
          <div className="mb-8">
            <p className="font-bold text-teal">Mixed mock exam</p>

            <h1 className="mt-2 text-4xl font-black text-navy">
              Test yourself across every SPSV category
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Every mock is generated randomly using questions from
              Fares, Driver Licensing, Accessibility, SPSV Business,
              Vehicle Licensing and all future categories.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Link href="/mock-exam?size=25">
              <Card className="h-full p-6 transition hover:border-teal hover:shadow-lg">
                <Clock3 className="size-8 text-teal" />
                <p className="mt-5 font-black text-teal">Quick mock</p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  25 questions
                </h2>
              </Card>
            </Link>

            <Link href="/mock-exam?size=40">
              <Card className="h-full p-6 transition hover:border-teal hover:shadow-lg">
                <ListChecks className="size-8 text-teal" />
                <p className="mt-5 font-black text-teal">Standard mock</p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  40 questions
                </h2>
              </Card>
            </Link>

            <Link href="/mock-exam?size=60">
              <Card className="h-full p-6 transition hover:border-teal hover:shadow-lg">
                <Trophy className="size-8 text-teal" />
                <p className="mt-5 font-black text-teal">Full mock</p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  60 questions
                </h2>
              </Card>
            </Link>

            <Link href="/mock-exam?size=all">
              <Card className="h-full p-6 transition hover:border-teal hover:shadow-lg">
                <Layers3 className="size-8 text-teal" />
                <p className="mt-5 font-black text-teal">Master test</p>
                <h2 className="mt-2 text-3xl font-black text-navy">
                  All questions
                </h2>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-snow">
      <div className="container">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-bold text-teal">Random mixed mock</p>

            <h1 className="mt-2 text-4xl font-black text-navy">
              SPSV Mock Examination
            </h1>
          </div>

          <Link
            href="/mock-exam"
            className="font-black text-teal hover:underline"
          >
            Change mock length
          </Link>
        </div>

        <MixedMockEngine mockLength={mockLength} />
      </div>
    </section>
  );
}
