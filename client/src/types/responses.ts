import type { AdventurerDto } from "./adventurer";
import type { SkillDto, SkillReference } from "./skill";

export type AvailableSkillsResponse = {
  acquirable: SkillDto[];
  locked: Array<{
    skill: SkillReference;
    unmetPrerequisites: Array<{
      type: string;
      detail: string;
    }>;
  }>;
};

export type LinkedAdventurersResponse = {
  owners: AdventurerDto[];
  eligible: AdventurerDto[];
};
