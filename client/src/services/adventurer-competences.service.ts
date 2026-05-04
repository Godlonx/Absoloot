import type { CompetenceDto, CompetencesDisponiblesResponse } from "@/types";
import { api } from "./api";

export const list = async (adventurerId: string): Promise<CompetenceDto[]> => {
  return api.get<CompetenceDto[]>(`/aventurers/${adventurerId}/competences`);
};

export const add = async (
  adventurerId: string,
  competenceId: string
): Promise<CompetenceDto> => {
  return api.post<CompetenceDto>(
    `/aventurers/${adventurerId}/competences/${competenceId}`
  );
};

export const remove = async (
  adventurerId: string,
  competenceId: string
): Promise<void> => {
  return api.delete(`/aventurers/${adventurerId}/competences/${competenceId}`);
};

export const listDisponibles = async (
  adventurerId: string
): Promise<CompetencesDisponiblesResponse> => {
  return api.get<CompetencesDisponiblesResponse>(
    `/aventurers/${adventurerId}/competences/disponibles`
  );
};
