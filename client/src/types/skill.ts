import type { AdvClass } from "./adventurer";

export type Attribute = "physical" | "mental" | "perception";

export type AttributeMin = {
  attribute: Attribute;
  value: number;
};

export type SkillReference = {
  id: string;
  name: string;
};

export type Prerequisite = {
  classRequired?: AdvClass | null;
  minimumLevel?: number | null;
  attributeMin?: AttributeMin | null;
  skillsRequired?: SkillReference[];
};

export type SkillPayload = {
  name: string;
  description?: string;
  classRequired?: AdvClass | null;
  minimumLevel?: number | null;
  attributeMin?: AttributeMin | null;
  skillsRequired?: string[];
};

export type SkillDto = {
  id: string;
  name: string;
  description?: string;
  prerequisite: Prerequisite;
};
