import type {
  SkillDto,
  SkillPayload,
  PaginatedResponse,
  LinkedAdventurersResponse,
  AdventurerDto,
} from "@/types"
import {
  getSkills,
  getSkill,
  createSkill as createSkillData,
  updateSkill as updateSkillData,
  deleteSkill as deleteSkillData,
} from "../data/skills"
import { getAdventurers, getAdventurerSkills } from "../data/adventurers"

export const list = async (
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<SkillDto>> => {
  const all = getSkills()
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

export const get = async (id: string): Promise<SkillDto> => {
  const skill = getSkill(id)
  if (!skill) {
    throw { status: 404, message: "Compétence non trouvée" }
  }
  return skill
}

export const create = async (payload: SkillPayload): Promise<SkillDto> => {
  return createSkillData(payload)
}

export const update = async (
  id: string,
  payload: Partial<SkillPayload>
): Promise<SkillDto> => {
  const result = updateSkillData(id, payload)
  if (!result) {
    throw { status: 404, message: "Compétence non trouvée" }
  }
  return result
}

export const remove = async (id: string): Promise<void> => {
  const success = deleteSkillData(id)
  if (!success) {
    throw { status: 404, message: "Compétence non trouvée" }
  }
}

export const getAdventurersLinked = async (
  skillId: string
): Promise<LinkedAdventurersResponse> => {
  const skill = getSkill(skillId)
  if (!skill) {
    throw { status: 404, message: "Compétence non trouvée" }
  }

  const allAdventurers = getAdventurers()
  const owners: AdventurerDto[] = []
  const eligible: AdventurerDto[] = []

  for (const adventurer of allAdventurers) {
    const skills = getAdventurerSkills(adventurer.id)
    if (skills.includes(skillId)) {
      owners.push(adventurer)
    } else if (checkEligibility(adventurer, skill)) {
      eligible.push(adventurer)
    }
  }

  return { owners, eligible }
}

const checkEligibility = (
  adventurer: AdventurerDto,
  skill: SkillDto
): boolean => {
  const prereq = skill.prerequisite

  if (prereq.classRequired && adventurer.advClass !== prereq.classRequired) {
    return false
  }

  if (prereq.minimumLevel && adventurer.level < prereq.minimumLevel) {
    return false
  }

  if (prereq.attributeMin) {
    const { attribute, value } = prereq.attributeMin
    if (adventurer[attribute] < value) {
      return false
    }
  }

  if (prereq.skillsRequired && prereq.skillsRequired.length > 0) {
    const adventurerSkills = getAdventurerSkills(adventurer.id)
    for (const required of prereq.skillsRequired) {
      if (!adventurerSkills.includes(required.id)) {
        return false
      }
    }
  }

  return true
}
