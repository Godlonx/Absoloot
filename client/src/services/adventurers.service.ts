import type { AdventurerDto, AdventurerPayload } from "@/types";
import { api } from "./api";
import { isMockEnabled, mockAdventurersService } from "@/mocks";

export const list = async (): Promise<AdventurerDto[]> => {
  if (isMockEnabled()) {
    return mockAdventurersService.list();
  }
  return api.get<AdventurerDto[]>("/adventurers");
};

export const get = async (id: string): Promise<AdventurerDto> => {
  if (isMockEnabled()) {
    return mockAdventurersService.get(id);
  }
  return api.get<AdventurerDto>(`/adventurers/${id}`);
};

export const create = async (data: AdventurerPayload): Promise<AdventurerDto> => {
  if (isMockEnabled()) {
    return mockAdventurersService.create(data);
  }
  return api.post<AdventurerDto>("/adventurers", data);
};

export const update = async (id: string, data: AdventurerPayload): Promise<AdventurerDto> => {
  if (isMockEnabled()) {
    return mockAdventurersService.update(id, data);
  }
  return api.put<AdventurerDto>(`/adventurers/${id}`, data);
};

export const remove = async (id: string): Promise<void> => {
  if (isMockEnabled()) {
    return mockAdventurersService.remove(id);
  }
  return api.delete(`/adventurers/${id}`);
};
