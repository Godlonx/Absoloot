import type { AdventurerDto, AdventurerPayload } from "@/types";
import { api } from "./api";

export const list = async (): Promise<AdventurerDto[]> => {
  return api.get<AdventurerDto[]>("/aventurers");
};

export const get = async (id: string): Promise<AdventurerDto> => {
  return api.get<AdventurerDto>(`/aventurers/${id}`);
};

export const create = async (data: AdventurerPayload): Promise<AdventurerDto> => {
  return api.post<AdventurerDto>("/aventurers", data);
};

export const update = async (id: string, data: AdventurerPayload): Promise<AdventurerDto> => {
  return api.put<AdventurerDto>(`/aventurers/${id}`, data);
};

export const remove = async (id: string): Promise<void> => {
  return api.delete(`/aventurers/${id}`);
};
