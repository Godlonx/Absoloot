import type { AdventurerDto } from "@/types"

export const mockAdventurers: AdventurerDto[] = [
  {
    id: "adv-001",
    name: "Thorin Oakenshield",
    advClass: "GUERRIER",
    level: 45,
    physical: 42,
    mental: 18,
    perception: 25,
    description: "Un guerrier nain légendaire, chef de la Compagnie.",
  },
  {
    id: "adv-002",
    name: "Elara Moonwhisper",
    advClass: "MAGE",
    level: 38,
    physical: 12,
    mental: 45,
    perception: 35,
    description: "Une magicienne elfe spécialisée dans la magie lunaire.",
  },
  {
    id: "adv-003",
    name: "Shadowbane",
    advClass: "VOLEUR",
    level: 52,
    physical: 35,
    mental: 28,
    perception: 48,
    description: "Un assassin mystérieux dont personne ne connaît le vrai nom.",
  },
  {
    id: "adv-004",
    name: "Brother Marcus",
    advClass: "CLERC",
    level: 30,
    physical: 15,
    mental: 40,
    perception: 30,
    description: "Un prêtre dévoué au service des plus démunis.",
  },
  {
    id: "adv-005",
    name: "Lyra Swiftbow",
    advClass: "RODEUR",
    level: 28,
    physical: 30,
    mental: 22,
    perception: 45,
    description: "Une archère des forêts du Nord, experte en pistage.",
  },
  {
    id: "adv-006",
    name: "Grimlock the Unstoppable",
    advClass: "BARBARE",
    level: 60,
    physical: 50,
    mental: 8,
    perception: 15,
    description: "Un berserker orc dont la rage est légendaire.",
  },
  {
    id: "adv-007",
    name: "Seraphina Lightbringer",
    advClass: "PALADIN",
    level: 42,
    physical: 38,
    mental: 32,
    perception: 28,
    description: "Une paladine au service de la lumière divine.",
  },
  {
    id: "adv-008",
    name: "Zephyr Windwalker",
    advClass: "MOINE",
    level: 35,
    physical: 32,
    mental: 38,
    perception: 40,
    description: "Un moine ayant atteint l'illumination par la méditation.",
  },
  {
    id: "adv-009",
    name: "Viktor Ironforge",
    advClass: "GUERRIER",
    level: 25,
    physical: 40,
    mental: 20,
    perception: 18,
    description: "Un forgeron nain capable de créer des armes légendaires.",
  },
  {
    id: "adv-010",
    name: "Nyx Shadowdancer",
    advClass: "VOLEUR",
    level: 48,
    physical: 28,
    mental: 30,
    perception: 46,
    description: "Une assassine tiefling maîtrisant les arts de l'ombre.",
  },
  {
    id: "adv-011",
    name: "Aldric Stormcaller",
    advClass: "MAGE",
    level: 55,
    physical: 10,
    mental: 48,
    perception: 32,
    description: "Un archimage humain spécialisé dans la magie élémentaire.",
  },
  {
    id: "adv-012",
    name: "Kira Flameheart",
    advClass: "GUERRIER",
    level: 33,
    physical: 36,
    mental: 20,
    perception: 24,
    description: "Une guerrière au tempérament de feu.",
  },
  {
    id: "adv-013",
    name: "Orion Stargazer",
    advClass: "RODEUR",
    level: 40,
    physical: 28,
    mental: 25,
    perception: 50,
    description: "Un ranger nocturne guidé par les étoiles.",
  },
  {
    id: "adv-014",
    name: "Sister Helena",
    advClass: "CLERC",
    level: 22,
    physical: 12,
    mental: 35,
    perception: 28,
    description: "Une prêtresse novice mais prometteuse.",
  },
]

let adventurersStore = [...mockAdventurers]
let adventurerCompetences: Record<string, string[]> = {
  "adv-001": ["comp-001", "comp-003"],
  "adv-002": ["comp-002", "comp-004"],
  "adv-003": ["comp-001", "comp-005"],
  "adv-006": ["comp-001", "comp-003", "comp-006"],
  "adv-007": ["comp-001", "comp-002"],
  "adv-011": ["comp-002", "comp-004", "comp-007"],
}

export const getAdventurers = () => [...adventurersStore]

export const getAdventurer = (id: string) =>
  adventurersStore.find((a) => a.id === id)

export const createAdventurer = (
  payload: Omit<AdventurerDto, "id">
): AdventurerDto => {
  const newAdventurer: AdventurerDto = {
    ...payload,
    id: `adv-${Date.now()}`,
  }
  adventurersStore.push(newAdventurer)
  adventurerCompetences[newAdventurer.id] = []
  return newAdventurer
}

export const updateAdventurer = (
  id: string,
  payload: Partial<AdventurerDto>
): AdventurerDto | null => {
  const index = adventurersStore.findIndex((a) => a.id === id)
  if (index === -1) return null
  adventurersStore[index] = { ...adventurersStore[index], ...payload }
  return adventurersStore[index]
}

export const deleteAdventurer = (id: string): boolean => {
  const index = adventurersStore.findIndex((a) => a.id === id)
  if (index === -1) return false
  adventurersStore.splice(index, 1)
  delete adventurerCompetences[id]
  return true
}

export const getAdventurerCompetences = (adventurerId: string): string[] =>
  adventurerCompetences[adventurerId] || []

export const addCompetenceToAdventurer = (
  adventurerId: string,
  competenceId: string
): void => {
  if (!adventurerCompetences[adventurerId]) {
    adventurerCompetences[adventurerId] = []
  }
  if (!adventurerCompetences[adventurerId].includes(competenceId)) {
    adventurerCompetences[adventurerId].push(competenceId)
  }
}

export const removeCompetenceFromAdventurer = (
  adventurerId: string,
  competenceId: string
): void => {
  if (adventurerCompetences[adventurerId]) {
    adventurerCompetences[adventurerId] = adventurerCompetences[
      adventurerId
    ].filter((id) => id !== competenceId)
  }
}

export const resetAdventurersStore = () => {
  adventurersStore = [...mockAdventurers]
  adventurerCompetences = {
    "adv-001": ["comp-001", "comp-003"],
    "adv-002": ["comp-002", "comp-004"],
    "adv-003": ["comp-001", "comp-005"],
    "adv-006": ["comp-001", "comp-003", "comp-006"],
    "adv-007": ["comp-001", "comp-002"],
    "adv-011": ["comp-002", "comp-004", "comp-007"],
  }
}
