import { learningModules } from "@/lib/module-data";
import type { LearningModuleData, LearningQuestion } from "@/lib/learning-module";

export type QuestionBankModule = LearningModuleData;

export const questionBankModules = Object.values(learningModules);

export function getQuestionBankModule(moduleId: string) {
  return questionBankModules.find((module) => module.id === moduleId);
}

export function getAllQuestions() {
  return questionBankModules.flatMap((module) =>
    module.questions.map((question) => ({
      ...question,
      moduleTitle: module.eyebrow.replace(" module", ""),
      lessonTitle: module.lessons.find((lesson) => lesson.id === question.lessonId)?.title ?? question.lessonId
    }))
  );
}

export function getQuestionStats() {
  const allQuestions = getAllQuestions();
  const byModule = questionBankModules.map((module) => ({
    id: module.id,
    title: module.eyebrow.replace(" module", ""),
    count: module.questions.length,
    target: module.targetQuestionCount,
    lessons: module.lessons.filter((lesson) => !lesson.isFinalTest).length
  }));

  return {
    totalQuestions: allQuestions.length,
    totalModules: questionBankModules.length,
    byModule
  };
}

export function answerLetters(question: Pick<LearningQuestion, "correctAnswers">) {
  return question.correctAnswers.map((index) => String.fromCharCode(65 + index));
}
