import type { Caracteristique, Prerequis } from "@/types"

const CARACTERISTIQUE_LABELS: Record<Caracteristique, string> = {
  physical: "Physique",
  mental: "Mental",
  perception: "Perception",
}

export const formatPrerequis = (prerequis: Prerequis): string[] => {
  const lines: string[] = []

  if (prerequis.classeRequise) {
    lines.push(`Classe: ${prerequis.classeRequise}`)
  }
  if (prerequis.niveauMinimum) {
    lines.push(`Niveau min: ${prerequis.niveauMinimum}`)
  }
  if (prerequis.caracteristiqueMin) {
    const { caracteristique, valeur } = prerequis.caracteristiqueMin
    lines.push(`${CARACTERISTIQUE_LABELS[caracteristique]} ≥ ${valeur}`)
  }

  return lines
}
