import type { AdvClass } from "./adventurer";

export type Caracteristique = "physical" | "mental" | "perception";

export type CaracteristiqueMin = {
  caracteristique: Caracteristique;
  valeur: number;
};

export type CompetenceReference = {
  id: string;
  nom: string;
};

export type Prerequis = {
  classeRequise?: AdvClass | null;
  niveauMinimum?: number | null;
  caracteristiqueMin?: CaracteristiqueMin | null;
  competencesRequises?: CompetenceReference[];
};

export type CompetencePayload = {
  nom: string;
  description?: string;
  classeRequise?: AdvClass | null;
  niveauMinimum?: number | null;
  caracteristiqueMin?: CaracteristiqueMin | null;
  competencesRequises?: string[];
};

export type CompetenceDto = {
  id: string;
  nom: string;
  description?: string;
  prerequis: Prerequis;
};
