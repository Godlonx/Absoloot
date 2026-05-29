import type {
  LinkedAdventurersResponse,
  SkillDto,
  SkillPayload,
  PaginatedResponse,
} from "@/types";
import { api } from "./api";
import { isMockEnabled, mockSkillsService } from "@/mocks";

export const list = async (
  page?: number,
  size?: number
): Promise<PaginatedResponse<SkillDto>> => {
  if (isMockEnabled()) {
    return mockSkillsService.list(page, size);
  }
  const params = new URLSearchParams();
  if (page !== undefined) params.append("page", String(page));
  if (size !== undefined) params.append("size", String(size));
  const query = params.toString();
  return api.get<PaginatedResponse<SkillDto>>(
    `/skills${query ? `?${query}` : ""}`
  );
};

export const get = async (id: string): Promise<SkillDto> => {
  if (isMockEnabled()) {
    return mockSkillsService.get(id);
  }
  return api.get<SkillDto>(`/skills/${id}`);
};

export const create = async (data: SkillPayload): Promise<SkillDto> => {
  if (isMockEnabled()) {
    return mockSkillsService.create(data);
  }
  return api.post<SkillDto>("/skills", data);
};

export const update = async (
  id: string,
  data: SkillPayload
): Promise<SkillDto> => {
  if (isMockEnabled()) {
    return mockSkillsService.update(id, data);
  }
  return api.put<SkillDto>(`/skills/${id}`, data);
};

export const remove = async (id: string): Promise<void> => {
  if (isMockEnabled()) {
    return mockSkillsService.remove(id);
  }
  return api.delete(`/skills/${id}`);
};

export const getAdventurersLinked = async (
  id: string
): Promise<LinkedAdventurersResponse> => {
  if (isMockEnabled()) {
    return mockSkillsService.getAdventurersLinked(id);
  }
  return api.get<LinkedAdventurersResponse>(`/skills/${id}/adventurers`);
};
