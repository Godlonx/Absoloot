import type { CompetenceDto, CompetencesDisponiblesResponse } from "@/types";
import { api } from "./api";
import { isMockEnabled, mockAdventurerCompetencesService } from "@/mocks";

export const list = async (adventurerId: string): Promise<CompetenceDto[]> => {
  if (isMockEnabled()) {
    return mockAdventurerCompetencesService.list(adventurerId);
  }
  return api.get<CompetenceDto[]>(`/aventurers/${adventurerId}/competences`);
};

export const add = async (
  adventurerId: string,
  competenceId: string
): Promise<CompetenceDto | void> => {
  if (isMockEnabled()) {
    return mockAdventurerCompetencesService.add(adventurerId, competenceId);
  }
  return api.post<CompetenceDto>(
    `/aventurers/${adventurerId}/competences/${competenceId}`
  );
};

export const remove = async (
  adventurerId: string,
  competenceId: string
): Promise<void> => {
  if (isMockEnabled()) {
    return mockAdventurerCompetencesService.remove(adventurerId, competenceId);
  }
  return api.delete(`/aventurers/${adventurerId}/competences/${competenceId}`);
};

export const listDisponibles = async (
  adventurerId: string
): Promise<CompetencesDisponiblesResponse> => {
  if (isMockEnabled()) {
    return mockAdventurerCompetencesService.listDisponibles(adventurerId);
  }
  return api.get<CompetencesDisponiblesResponse>(
    `/aventurers/${adventurerId}/competences/disponibles`
  );
};
