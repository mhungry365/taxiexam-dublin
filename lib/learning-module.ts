export type QuestionType = "single" | "multiple";

export type LearningLesson = {
  id: string;
  title: string;
  intro: string;
  memoryTrick: string;
  commonMistakes: string[];
  tags: string[];
  isFinalTest?: boolean;
};

export type LearningQuestion = {
  id: string;
  module: string;
  lessonId: string;
  questionNumber: number;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  memoryTip: string;
  commonMistake: string;
  tags: string[];
  source: string;
};

export type LearningModuleData = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  targetQuestionCount: number;
  lessons: LearningLesson[];
  questions: LearningQuestion[];
};

export function getQuestionsForLesson(module: LearningModuleData, lessonId: string) {
  const lesson = module.lessons.find((item) => item.id === lessonId);
  if (lesson?.isFinalTest) return module.questions;
  return module.questions.filter((question) => question.lessonId === lessonId);
}

export function isQuestionCorrect(question: LearningQuestion, selected: number[]) {
  return (
    selected.length === question.correctAnswers.length &&
    question.correctAnswers.every((answer) => selected.includes(answer))
  );
}

export function getLessonScore(answers: Record<string, number[]>, questions: LearningQuestion[]) {
  const correct = questions.filter((question) => isQuestionCorrect(question, answers[question.id] ?? [])).length;

  return {
    correct,
    total: questions.length,
    percent: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
  };
}

export function getWeakTopics(module: LearningModuleData, answers: Record<string, number[]>) {
  const missedTags = new Map<string, number>();

  module.questions.forEach((question) => {
    const selected = answers[question.id] ?? [];
    if (selected.length > 0 && !isQuestionCorrect(question, selected)) {
      question.tags.forEach((tag) => missedTags.set(tag, (missedTags.get(tag) ?? 0) + 1));
    }
  });

  return [...missedTags.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
