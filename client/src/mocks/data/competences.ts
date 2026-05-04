import type { CompetenceDto } from "@/types"

export const mockCompetences: CompetenceDto[] = [
  {
    id: "comp-001",
    nom: "Maîtrise des armes",
    description:
      "Permet d'utiliser efficacement toutes les armes de mêlée standard.",
    prerequis: {
      niveauMinimum: 5,
      caracteristiqueMin: { caracteristique: "physical", valeur: 15 },
    },
  },
  {
    id: "comp-002",
    nom: "Canalisation magique",
    description: "Capacité à canaliser l'énergie magique pour lancer des sorts.",
    prerequis: {
      classeRequise: "MAGE",
      niveauMinimum: 10,
      caracteristiqueMin: { caracteristique: "mental", valeur: 25 },
    },
  },
  {
    id: "comp-003",
    nom: "Rage du berserker",
    description:
      "Entre dans une fureur dévastatrice augmentant les dégâts mais réduisant la défense.",
    prerequis: {
      classeRequise: "BARBARE",
      niveauMinimum: 15,
      caracteristiqueMin: { caracteristique: "physical", valeur: 30 },
      competencesRequises: [{ id: "comp-001", nom: "Maîtrise des armes" }],
    },
  },
  {
    id: "comp-004",
    nom: "Téléportation",
    description: "Permet de se téléporter sur de courtes distances.",
    prerequis: {
      classeRequise: "MAGE",
      niveauMinimum: 25,
      caracteristiqueMin: { caracteristique: "mental", valeur: 35 },
      competencesRequises: [{ id: "comp-002", nom: "Canalisation magique" }],
    },
  },
  {
    id: "comp-005",
    nom: "Frappe silencieuse",
    description:
      "Attaque furtive infligeant des dégâts critiques depuis les ombres.",
    prerequis: {
      classeRequise: "VOLEUR",
      niveauMinimum: 20,
      caracteristiqueMin: { caracteristique: "perception", valeur: 30 },
    },
  },
  {
    id: "comp-006",
    nom: "Cri de guerre",
    description:
      "Pousse un cri terrifiant qui intimide les ennemis et renforce les alliés.",
    prerequis: {
      niveauMinimum: 30,
      caracteristiqueMin: { caracteristique: "physical", valeur: 25 },
      competencesRequises: [{ id: "comp-001", nom: "Maîtrise des armes" }],
    },
  },
  {
    id: "comp-007",
    nom: "Invocation élémentaire",
    description: "Invoque un élémentaire pour combattre à vos côtés.",
    prerequis: {
      classeRequise: "MAGE",
      niveauMinimum: 40,
      caracteristiqueMin: { caracteristique: "mental", valeur: 40 },
      competencesRequises: [
        { id: "comp-002", nom: "Canalisation magique" },
        { id: "comp-004", nom: "Téléportation" },
      ],
    },
  },
  {
    id: "comp-008",
    nom: "Vision nocturne",
    description: "Permet de voir parfaitement dans l'obscurité totale.",
    prerequis: {
      niveauMinimum: 10,
      caracteristiqueMin: { caracteristique: "perception", valeur: 20 },
    },
  },
  {
    id: "comp-009",
    nom: "Méditation profonde",
    description:
      "Récupère rapidement l'énergie mentale par une méditation intense.",
    prerequis: {
      classeRequise: "MOINE",
      niveauMinimum: 15,
      caracteristiqueMin: { caracteristique: "mental", valeur: 25 },
    },
  },
  {
    id: "comp-010",
    nom: "Bénédiction divine",
    description: "Invoque la faveur des dieux pour soigner et protéger.",
    prerequis: {
      classeRequise: "CLERC",
      niveauMinimum: 20,
      caracteristiqueMin: { caracteristique: "mental", valeur: 30 },
    },
  },
]

let competencesStore = [...mockCompetences]

export const getCompetences = () => [...competencesStore]

export const getCompetence = (id: string) =>
  competencesStore.find((c) => c.id === id)

export const createCompetence = (payload: {
  nom: string
  description?: string
  classeRequise?: string | null
  niveauMinimum?: number | null
  caracteristiqueMin?: { caracteristique: string; valeur: number } | null
  competencesRequises?: string[]
}): CompetenceDto => {
  const requiredCompetences = payload.competencesRequises
    ? payload.competencesRequises
        .map((id) => {
          const comp = competencesStore.find((c) => c.id === id)
          return comp ? { id: comp.id, nom: comp.nom } : null
        })
        .filter(Boolean) as { id: string; nom: string }[]
    : undefined

  const newCompetence: CompetenceDto = {
    id: `comp-${Date.now()}`,
    nom: payload.nom,
    description: payload.description,
    prerequis: {
      classeRequise: (payload.classeRequise as CompetenceDto["prerequis"]["classeRequise"]) || undefined,
      niveauMinimum: payload.niveauMinimum ?? undefined,
      caracteristiqueMin: payload.caracteristiqueMin as CompetenceDto["prerequis"]["caracteristiqueMin"] ?? undefined,
      competencesRequises:
        requiredCompetences && requiredCompetences.length > 0
          ? requiredCompetences
          : undefined,
    },
  }
  competencesStore.push(newCompetence)
  return newCompetence
}

export const updateCompetence = (
  id: string,
  payload: {
    nom?: string
    description?: string
    classeRequise?: string | null
    niveauMinimum?: number | null
    caracteristiqueMin?: { caracteristique: string; valeur: number } | null
    competencesRequises?: string[]
  }
): CompetenceDto | null => {
  const index = competencesStore.findIndex((c) => c.id === id)
  if (index === -1) return null

  const existing = competencesStore[index]
  const requiredCompetences = payload.competencesRequises
    ? payload.competencesRequises
        .map((compId) => {
          const comp = competencesStore.find((c) => c.id === compId)
          return comp ? { id: comp.id, nom: comp.nom } : null
        })
        .filter(Boolean) as { id: string; nom: string }[]
    : existing.prerequis.competencesRequises

  competencesStore[index] = {
    ...existing,
    nom: payload.nom ?? existing.nom,
    description: payload.description ?? existing.description,
    prerequis: {
      classeRequise:
        payload.classeRequise !== undefined
          ? (payload.classeRequise as CompetenceDto["prerequis"]["classeRequise"]) || undefined
          : existing.prerequis.classeRequise,
      niveauMinimum:
        payload.niveauMinimum !== undefined
          ? payload.niveauMinimum ?? undefined
          : existing.prerequis.niveauMinimum,
      caracteristiqueMin:
        payload.caracteristiqueMin !== undefined
          ? (payload.caracteristiqueMin as CompetenceDto["prerequis"]["caracteristiqueMin"]) ?? undefined
          : existing.prerequis.caracteristiqueMin,
      competencesRequises:
        requiredCompetences && requiredCompetences.length > 0
          ? requiredCompetences
          : undefined,
    },
  }

  return competencesStore[index]
}

export const deleteCompetence = (id: string): boolean => {
  const index = competencesStore.findIndex((c) => c.id === id)
  if (index === -1) return false
  competencesStore.splice(index, 1)
  return true
}

export const resetCompetencesStore = () => {
  competencesStore = [...mockCompetences]
}
