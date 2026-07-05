import type { LearningModuleData } from "@/lib/learning-module";
import fares from "@/data/modules/fares.json";
import driverLicensing from "@/data/modules/driver-licensing.json";

export const learningModules = {
  fares,
  "driver-licensing": driverLicensing
} satisfies Record<string, LearningModuleData>;

export type LearningModuleId = keyof typeof learningModules;

export function getLearningModule(id: LearningModuleId) {
  return learningModules[id];
}
