import type {
  CompetenceDto,
  CompetencePayload,
  PaginatedResponse,
  AventuriersLiesResponse,
  AdventurerDto,
} from "@/types"
import {
  getCompetences,
  getCompetence,
  createCompetence as createCompetenceData,
  updateCompetence as updateCompetenceData,
  deleteCompetence as deleteCompetenceData,
} from "../data/competences"
import { getAdventurers, getAdventurerCompetences } from "../data/adventurers"

export const list = async (
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<CompetenceDto>> => {
  const all = getCompetences()
  const start = page * size
  const end = start + size
  const content = all.slice(start, end)

  return {
    content,
    currentPage: page,
    totalPages: Math.ceil(all.length / size),
    totalElements: all.length,
  }
}

export const get = async (id: string): Promise<CompetenceDto> => {
  const competence = getCompetence(id)
  if (!competence) {
    throw { status: 404, message: "Compétence non trouvée" }
  }
  return competence
}

export const create = async (payload: CompetencePayload): Promise<CompetenceDto> => {
  return createCompetenceData(payload)
}

export const update = async (
  id: string,
  payload: Partial<CompetencePayload>
): Promise<CompetenceDto> => {
  const result = updateCompetenceData(id, payload)
  if (!result) {
    throw { status: 404, message: "Compétence non trouvée" }
  }
  return result
}

export const remove = async (id: string): Promise<void> => {
  const success = deleteCompetenceData(id)
  if (!success) {
    throw { status: 404, message: "Compétence non trouvée" }
  }
}

export const getAventurersLinked = async (
  competenceId: string
): Promise<AventuriersLiesResponse> => {
  const competence = getCompetence(competenceId)
  if (!competence) {
    throw { status: 404, message: "Compétence non trouvée" }
  }

  const allAdventurers = getAdventurers()
  const possesseurs: AdventurerDto[] = []
  const eligibles: AdventurerDto[] = []

  for (const adventurer of allAdventurers) {
    const competences = getAdventurerCompetences(adventurer.id)
    if (competences.includes(competenceId)) {
      possesseurs.push(adventurer)
    } else if (checkEligibility(adventurer, competence)) {
      eligibles.push(adventurer)
    }
  }

  return { possesseurs, eligibles }
}

const checkEligibility = (
  adventurer: AdventurerDto,
  competence: CompetenceDto
): boolean => {
  const prereq = competence.prerequis

  if (prereq.classeRequise && adventurer.advClass !== prereq.classeRequise) {
    return false
  }

  if (prereq.niveauMinimum && adventurer.level < prereq.niveauMinimum) {
    return false
  }

  if (prereq.caracteristiqueMin) {
    const { caracteristique, valeur } = prereq.caracteristiqueMin
    if (adventurer[caracteristique] < valeur) {
      return false
    }
  }

  if (prereq.competencesRequises && prereq.competencesRequises.length > 0) {
    const adventurerCompetences = getAdventurerCompetences(adventurer.id)
    for (const required of prereq.competencesRequises) {
      if (!adventurerCompetences.includes(required.id)) {
        return false
      }
    }
  }

  return true
}
