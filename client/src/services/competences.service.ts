import type {
  AventuriersLiesResponse,
  CompetenceDto,
  CompetencePayload,
  PaginatedResponse,
} from "@/types";
import { api } from "./api";
import { isMockEnabled, mockCompetencesService } from "@/mocks";

export const list = async (
  page?: number,
  size?: number
): Promise<PaginatedResponse<CompetenceDto>> => {
  if (isMockEnabled()) {
    return mockCompetencesService.list(page, size);
  }
  const params = new URLSearchParams();
  if (page !== undefined) params.append("page", String(page));
  if (size !== undefined) params.append("size", String(size));
  const query = params.toString();
  return api.get<PaginatedResponse<CompetenceDto>>(
    `/competences${query ? `?${query}` : ""}`
  );
};

export const get = async (id: string): Promise<CompetenceDto> => {
  if (isMockEnabled()) {
    return mockCompetencesService.get(id);
  }
  return api.get<CompetenceDto>(`/competences/${id}`);
};

export const create = async (data: CompetencePayload): Promise<CompetenceDto> => {
  if (isMockEnabled()) {
    return mockCompetencesService.create(data);
  }
  return api.post<CompetenceDto>("/competences", data);
};

export const update = async (
  id: string,
  data: CompetencePayload
): Promise<CompetenceDto> => {
  if (isMockEnabled()) {
    return mockCompetencesService.update(id, data);
  }
  return api.put<CompetenceDto>(`/competences/${id}`, data);
};

export const remove = async (id: string): Promise<void> => {
  if (isMockEnabled()) {
    return mockCompetencesService.remove(id);
  }
  return api.delete(`/competences/${id}`);
};

export const getAventurersLinked = async (
  id: string
): Promise<AventuriersLiesResponse> => {
  if (isMockEnabled()) {
    return mockCompetencesService.getAventurersLinked(id);
  }
  return api.get<AventuriersLiesResponse>(`/competences/${id}/aventurers`);
};
