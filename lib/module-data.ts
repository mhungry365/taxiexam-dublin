import fares from "@/data/modules/fares.json";
import driverLicensing from "@/data/modules/driver-licensing.json";
import accessibility from "@/data/modules/accessibility.json";
import spsvBusiness from "@/data/modules/spsv-business.json";
import vehicleLicensing from "@/data/modules/vehicle-licensing.json";
import spsvIndustry from "@/data/modules/spsv-industry.json";
import dublinArea from "@/data/modules/dublin-area.json";
import type { LearningModuleData } from "@/lib/learning-module";

export const learningModules: Record<string, LearningModuleData> = {
  fares: fares as LearningModuleData,
  "driver-licensing": driverLicensing as LearningModuleData,
  "accessibility": accessibility as LearningModuleData,
  "spsv-business": spsvBusiness as LearningModuleData,
  "vehicle-licensing": vehicleLicensing as LearningModuleData,
  "spsv-industry": spsvIndustry as LearningModuleData,
  "dublin-area": dublinArea as LearningModuleData
};

export type LearningModuleId = keyof typeof learningModules;

export function getLearningModule(id: LearningModuleId): LearningModuleData {
  return learningModules[id];
}
