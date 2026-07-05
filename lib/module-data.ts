import fares from "@/data/modules/fares.json";
import driverLicensing from "@/data/modules/driver-licensing.json";
import type { LearningModuleData } from "@/lib/learning-module";

export const learningModules: Record<string, LearningModuleData> = {
  fares: fares as LearningModuleData,
  "driver-licensing": driverLicensing as LearningModuleData
};

export type LearningModuleId = keyof typeof learningModules;

export function getLearningModule(id: LearningModuleId): LearningModuleData {
  return learningModules[id];
}
