import { faresLessons, faresQuestions, faresQuestionTargetCount } from "@/lib/fares-module";
import type { LearningModuleData } from "@/lib/learning-module";

export const faresLearningModule: LearningModuleData = {
  id: "fares",
  title: "Learn Fares lesson by lesson.",
  eyebrow: "Fares module",
  description:
    "Study fare topics in focused lessons, take a mini quiz, review wrong answers, and finish with a mixed Fares test using every loaded original question.",
  targetQuestionCount: faresQuestionTargetCount,
  lessons: faresLessons.map((lesson) => ({
    ...lesson,
    isFinalTest: lesson.id === "final-mixed-fares-test"
  })),
  questions: faresQuestions
};
