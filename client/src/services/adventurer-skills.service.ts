import type { SkillDto, AvailableSkillsResponse } from "@/types";
import { api } from "./api";
import { isMockEnabled, mockAdventurerSkillsService } from "@/mocks";

export const list = async (adventurerId: string): Promise<SkillDto[]> => {
  if (isMockEnabled()) {
    return mockAdventurerSkillsService.list(adventurerId);
  }
  return api.get<SkillDto[]>(`/adventurers/${adventurerId}/skills`);
};

export const add = async (
  adventurerId: string,
  skillId: string
): Promise<SkillDto | void> => {
  if (isMockEnabled()) {
    return mockAdventurerSkillsService.add(adventurerId, skillId);
  }
  return api.post<SkillDto>(
    `/adventurers/${adventurerId}/skills/${skillId}`
  );
};

export const remove = async (
  adventurerId: string,
  skillId: string
): Promise<void> => {
  if (isMockEnabled()) {
    return mockAdventurerSkillsService.remove(adventurerId, skillId);
  }
  return api.delete(`/adventurers/${adventurerId}/skills/${skillId}`);
};

export const listAvailable = async (
  adventurerId: string
): Promise<AvailableSkillsResponse> => {
  if (isMockEnabled()) {
    return mockAdventurerSkillsService.listAvailable(adventurerId);
  }
  return api.get<AvailableSkillsResponse>(
    `/adventurers/${adventurerId}/skills/available`
  );
};
