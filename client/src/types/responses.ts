import type { AdventurerDto } from "./adventurer";
import type { CompetenceDto, CompetenceReference } from "./competence";

export type CompetencesDisponiblesResponse = {
  acquerables: CompetenceDto[];
  bloquees: Array<{
    competence: CompetenceReference;
    prerequisManquants: Array<{
      type: string;
      detail: string;
    }>;
  }>;
};

export type AventuriersLiesResponse = {
  possesseurs: AdventurerDto[];
  eligibles: AdventurerDto[];
};
