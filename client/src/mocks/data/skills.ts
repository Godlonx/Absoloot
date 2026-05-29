import type { SkillDto } from "@/types"

export const mockSkills: SkillDto[] = [
  {
    id: "comp-001",
    name: "Maîtrise des armes",
    description:
      "Permet d'utiliser efficacement toutes les armes de mêlée standard.",
    prerequisite: {
      minimumLevel: 5,
      attributeMin: { attribute: "physical", value: 15 },
    },
  },
  {
    id: "comp-002",
    name: "Canalisation magique",
    description: "Capacité à canaliser l'énergie magique pour lancer des sorts.",
    prerequisite: {
      classRequired: "MAGE",
      minimumLevel: 10,
      attributeMin: { attribute: "mental", value: 25 },
    },
  },
  {
    id: "comp-003",
    name: "Rage du berserker",
    description:
      "Entre dans une fureur dévastatrice augmentant les dégâts mais réduisant la défense.",
    prerequisite: {
      classRequired: "BARBARIAN",
      minimumLevel: 15,
      attributeMin: { attribute: "physical", value: 30 },
      skillsRequired: [{ id: "comp-001", name: "Maîtrise des armes" }],
    },
  },
  {
    id: "comp-004",
    name: "Téléportation",
    description: "Permet de se téléporter sur de courtes distances.",
    prerequisite: {
      classRequired: "MAGE",
      minimumLevel: 25,
      attributeMin: { attribute: "mental", value: 35 },
      skillsRequired: [{ id: "comp-002", name: "Canalisation magique" }],
    },
  },
  {
    id: "comp-005",
    name: "Frappe silencieuse",
    description:
      "Attaque furtive infligeant des dégâts critiques depuis les ombres.",
    prerequisite: {
      classRequired: "ROGUE",
      minimumLevel: 20,
      attributeMin: { attribute: "perception", value: 30 },
    },
  },
  {
    id: "comp-006",
    name: "Cri de guerre",
    description:
      "Pousse un cri terrifiant qui intimide les ennemis et renforce les alliés.",
    prerequisite: {
      minimumLevel: 30,
      attributeMin: { attribute: "physical", value: 25 },
      skillsRequired: [{ id: "comp-001", name: "Maîtrise des armes" }],
    },
  },
  {
    id: "comp-007",
    name: "Invocation élémentaire",
    description: "Invoque un élémentaire pour combattre à vos côtés.",
    prerequisite: {
      classRequired: "MAGE",
      minimumLevel: 40,
      attributeMin: { attribute: "mental", value: 40 },
      skillsRequired: [
        { id: "comp-002", name: "Canalisation magique" },
        { id: "comp-004", name: "Téléportation" },
      ],
    },
  },
  {
    id: "comp-008",
    name: "Vision nocturne",
    description: "Permet de voir parfaitement dans l'obscurité totale.",
    prerequisite: {
      minimumLevel: 10,
      attributeMin: { attribute: "perception", value: 20 },
    },
  },
  {
    id: "comp-009",
    name: "Méditation profonde",
    description:
      "Récupère rapidement l'énergie mentale par une méditation intense.",
    prerequisite: {
      classRequired: "MONK",
      minimumLevel: 15,
      attributeMin: { attribute: "mental", value: 25 },
    },
  },
  {
    id: "comp-010",
    name: "Bénédiction divine",
    description: "Invoque la faveur des dieux pour soigner et protéger.",
    prerequisite: {
      classRequired: "CLERIC",
      minimumLevel: 20,
      attributeMin: { attribute: "mental", value: 30 },
    },
  },
]

let skillsStore = [...mockSkills]

export const getSkills = () => [...skillsStore]

export const getSkill = (id: string) =>
  skillsStore.find((c) => c.id === id)

export const createSkill = (payload: {
  name: string
  description?: string
  classRequired?: string | null
  minimumLevel?: number | null
  attributeMin?: { attribute: string; value: number } | null
  skillsRequired?: string[]
}): SkillDto => {
  const requiredSkills = payload.skillsRequired
    ? payload.skillsRequired
        .map((id) => {
          const skill = skillsStore.find((c) => c.id === id)
          return skill ? { id: skill.id, name: skill.name } : null
        })
        .filter(Boolean) as { id: string; name: string }[]
    : undefined

  const newSkill: SkillDto = {
    id: `comp-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    prerequisite: {
      classRequired: (payload.classRequired as SkillDto["prerequisite"]["classRequired"]) || undefined,
      minimumLevel: payload.minimumLevel ?? undefined,
      attributeMin: payload.attributeMin as SkillDto["prerequisite"]["attributeMin"] ?? undefined,
      skillsRequired:
        requiredSkills && requiredSkills.length > 0
          ? requiredSkills
          : undefined,
    },
  }
  skillsStore.push(newSkill)
  return newSkill
}

export const updateSkill = (
  id: string,
  payload: {
    name?: string
    description?: string
    classRequired?: string | null
    minimumLevel?: number | null
    attributeMin?: { attribute: string; value: number } | null
    skillsRequired?: string[]
  }
): SkillDto | null => {
  const index = skillsStore.findIndex((c) => c.id === id)
  if (index === -1) return null

  const existing = skillsStore[index]
  const requiredSkills = payload.skillsRequired
    ? payload.skillsRequired
        .map((skillId) => {
          const skill = skillsStore.find((c) => c.id === skillId)
          return skill ? { id: skill.id, name: skill.name } : null
        })
        .filter(Boolean) as { id: string; name: string }[]
    : existing.prerequisite.skillsRequired

  skillsStore[index] = {
    ...existing,
    name: payload.name ?? existing.name,
    description: payload.description ?? existing.description,
    prerequisite: {
      classRequired:
        payload.classRequired !== undefined
          ? (payload.classRequired as SkillDto["prerequisite"]["classRequired"]) || undefined
          : existing.prerequisite.classRequired,
      minimumLevel:
        payload.minimumLevel !== undefined
          ? payload.minimumLevel ?? undefined
          : existing.prerequisite.minimumLevel,
      attributeMin:
        payload.attributeMin !== undefined
          ? (payload.attributeMin as SkillDto["prerequisite"]["attributeMin"]) ?? undefined
          : existing.prerequisite.attributeMin,
      skillsRequired:
        requiredSkills && requiredSkills.length > 0
          ? requiredSkills
          : undefined,
    },
  }

  return skillsStore[index]
}

export const deleteSkill = (id: string): boolean => {
  const index = skillsStore.findIndex((c) => c.id === id)
  if (index === -1) return false
  skillsStore.splice(index, 1)
  return true
}

export const resetSkillsStore = () => {
  skillsStore = [...mockSkills]
}
