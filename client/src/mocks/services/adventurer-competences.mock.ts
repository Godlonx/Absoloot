import type {
  CompetenceDto,
  CompetencesDisponiblesResponse,
  AdventurerDto,
} from "@/types"
import {
  getAdventurer,
  getAdventurerCompetences,
  addCompetenceToAdventurer,
  removeCompetenceFromAdventurer,
} from "../data/adventurers"
import { getCompetences, getCompetence } from "../data/competences"

export const list = async (adventurerId: string): Promise<CompetenceDto[]> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const competenceIds = getAdventurerCompetences(adventurerId)
  return competenceIds
    .map((id) => getCompetence(id))
    .filter(Boolean) as CompetenceDto[]
}

export const add = async (
  adventurerId: string,
  competenceId: string
): Promise<void> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const competence = getCompetence(competenceId)
  if (!competence) {
    throw { status: 404, message: "Compétence non trouvée" }
  }

  const existingCompetences = getAdventurerCompetences(adventurerId)
  if (existingCompetences.includes(competenceId)) {
    throw { status: 409, message: "L'aventurier possède déjà cette compétence" }
  }

  const missingPrereqs = checkPrerequisites(adventurer, competence, existingCompetences)
  if (missingPrereqs.length > 0) {
    throw {
      status: 422,
      message: `Prérequis manquants: ${missingPrereqs.join(", ")}`,
    }
  }

  addCompetenceToAdventurer(adventurerId, competenceId)
}

export const remove = async (
  adventurerId: string,
  competenceId: string
): Promise<void> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const existingCompetences = getAdventurerCompetences(adventurerId)
  if (!existingCompetences.includes(competenceId)) {
    throw { status: 404, message: "L'aventurier ne possède pas cette compétence" }
  }

  const dependentCompetences = findDependentCompetences(
    competenceId,
    existingCompetences
  )
  if (dependentCompetences.length > 0) {
    throw {
      status: 409,
      message: `Impossible de retirer: requis par ${dependentCompetences.join(", ")}`,
    }
  }

  removeCompetenceFromAdventurer(adventurerId, competenceId)
}

export const listDisponibles = async (
  adventurerId: string
): Promise<CompetencesDisponiblesResponse> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const existingCompetences = getAdventurerCompetences(adventurerId)
  const allCompetences = getCompetences()

  const acquerables: CompetenceDto[] = []
  const bloquees: CompetencesDisponiblesResponse["bloquees"] = []

  for (const competence of allCompetences) {
    if (existingCompetences.includes(competence.id)) {
      continue
    }

    const missingPrereqs = checkPrerequisites(
      adventurer,
      competence,
      existingCompetences
    )

    if (missingPrereqs.length === 0) {
      acquerables.push(competence)
    } else {
      bloquees.push({
        competence,
        prerequisManquants: missingPrereqs.map((detail) => ({
          type: "Prérequis",
          detail,
        })),
      })
    }
  }

  return { acquerables, bloquees }
}

const checkPrerequisites = (
  adventurer: AdventurerDto,
  competence: CompetenceDto,
  existingCompetences: string[]
): string[] => {
  const missing: string[] = []
  const prereq = competence.prerequis

  if (prereq.classeRequise && adventurer.advClass !== prereq.classeRequise) {
    missing.push(`Classe ${prereq.classeRequise} requise`)
  }

  if (prereq.niveauMinimum && adventurer.level < prereq.niveauMinimum) {
    missing.push(`Niveau ${prereq.niveauMinimum} requis`)
  }

  if (prereq.caracteristiqueMin) {
    const { caracteristique, valeur } = prereq.caracteristiqueMin
    if (adventurer[caracteristique] < valeur) {
      missing.push(`${caracteristique} >= ${valeur} requis`)
    }
  }

  if (prereq.competencesRequises && prereq.competencesRequises.length > 0) {
    for (const required of prereq.competencesRequises) {
      if (!existingCompetences.includes(required.id)) {
        missing.push(`Compétence "${required.nom}" requise`)
      }
    }
  }

  return missing
}

const findDependentCompetences = (
  competenceId: string,
  existingCompetences: string[]
): string[] => {
  const allCompetences = getCompetences()
  const dependent: string[] = []

  for (const compId of existingCompetences) {
    if (compId === competenceId) continue

    const competence = allCompetences.find((c) => c.id === compId)
    if (!competence) continue

    if (
      competence.prerequis.competencesRequises?.some((r) => r.id === competenceId)
    ) {
      dependent.push(competence.nom)
    }
  }

  return dependent
}
