import type {
  SkillDto,
  AvailableSkillsResponse,
  AdventurerDto,
} from "@/types"
import {
  getAdventurer,
  getAdventurerSkills,
  addSkillToAdventurer,
  removeSkillFromAdventurer,
} from "../data/adventurers"
import { getSkills, getSkill } from "../data/skills"

export const list = async (adventurerId: string): Promise<SkillDto[]> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const skillIds = getAdventurerSkills(adventurerId)
  return skillIds
    .map((id) => getSkill(id))
    .filter(Boolean) as SkillDto[]
}

export const add = async (
  adventurerId: string,
  skillId: string
): Promise<void> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const skill = getSkill(skillId)
  if (!skill) {
    throw { status: 404, message: "Compétence non trouvée" }
  }

  const existingSkills = getAdventurerSkills(adventurerId)
  if (existingSkills.includes(skillId)) {
    throw { status: 409, message: "L'aventurier possède déjà cette compétence" }
  }

  const missingPrereqs = checkPrerequisites(adventurer, skill, existingSkills)
  if (missingPrereqs.length > 0) {
    throw {
      status: 422,
      message: `Prérequis manquants: ${missingPrereqs.map((p) => p.detail).join(", ")}`,
      unmetPrerequisite: missingPrereqs[0],
    }
  }

  addSkillToAdventurer(adventurerId, skillId)
}

export const remove = async (
  adventurerId: string,
  skillId: string
): Promise<void> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const existingSkills = getAdventurerSkills(adventurerId)
  if (!existingSkills.includes(skillId)) {
    throw { status: 404, message: "L'aventurier ne possède pas cette compétence" }
  }

  const dependentSkills = findDependentSkills(skillId, existingSkills)
  if (dependentSkills.length > 0) {
    throw {
      status: 409,
      message: `Impossible de retirer: requis par ${dependentSkills.join(", ")}`,
    }
  }

  removeSkillFromAdventurer(adventurerId, skillId)
}

export const listAvailable = async (
  adventurerId: string
): Promise<AvailableSkillsResponse> => {
  const adventurer = getAdventurer(adventurerId)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }

  const existingSkills = getAdventurerSkills(adventurerId)
  const allSkills = getSkills()

  const acquirable: SkillDto[] = []
  const locked: AvailableSkillsResponse["locked"] = []

  for (const skill of allSkills) {
    if (existingSkills.includes(skill.id)) {
      continue
    }

    const missingPrereqs = checkPrerequisites(
      adventurer,
      skill,
      existingSkills
    )

    if (missingPrereqs.length === 0) {
      acquirable.push(skill)
    } else {
      locked.push({
        skill: { id: skill.id, name: skill.name },
        unmetPrerequisites: missingPrereqs,
      })
    }
  }

  return { acquirable, locked }
}

type UnmetPrerequisite = { type: string; detail: string }

const checkPrerequisites = (
  adventurer: AdventurerDto,
  skill: SkillDto,
  existingSkills: string[]
): UnmetPrerequisite[] => {
  const missing: UnmetPrerequisite[] = []
  const prereq = skill.prerequisite

  if (prereq.classRequired && adventurer.advClass !== prereq.classRequired) {
    missing.push({
      type: "classRequired",
      detail: `Classe ${prereq.classRequired} requise`,
    })
  }

  if (prereq.minimumLevel && adventurer.level < prereq.minimumLevel) {
    missing.push({
      type: "minimumLevel",
      detail: `Niveau ${prereq.minimumLevel} requis`,
    })
  }

  if (prereq.attributeMin) {
    const { attribute, value } = prereq.attributeMin
    if (adventurer[attribute] < value) {
      missing.push({
        type: "attributeMin",
        detail: `${attribute} >= ${value} requis`,
      })
    }
  }

  if (prereq.skillsRequired && prereq.skillsRequired.length > 0) {
    for (const required of prereq.skillsRequired) {
      if (!existingSkills.includes(required.id)) {
        missing.push({
          type: "skillsRequired",
          detail: `Compétence "${required.name}" requise`,
        })
      }
    }
  }

  return missing
}

const findDependentSkills = (
  skillId: string,
  existingSkills: string[]
): string[] => {
  const allSkills = getSkills()
  const dependent: string[] = []

  for (const skId of existingSkills) {
    if (skId === skillId) continue

    const skill = allSkills.find((c) => c.id === skId)
    if (!skill) continue

    if (
      skill.prerequisite.skillsRequired?.some((r) => r.id === skillId)
    ) {
      dependent.push(skill.name)
    }
  }

  return dependent
}
