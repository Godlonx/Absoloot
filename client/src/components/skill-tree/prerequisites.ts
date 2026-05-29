import type { Attribute, Prerequisite } from "@/types"

const ATTRIBUTE_LABELS: Record<Attribute, string> = {
  physical: "Physique",
  mental: "Mental",
  perception: "Perception",
}

export const formatPrerequisites = (prerequisite: Prerequisite): string[] => {
  const lines: string[] = []

  if (prerequisite.classRequired) {
    lines.push(`Classe: ${prerequisite.classRequired}`)
  }
  if (prerequisite.minimumLevel) {
    lines.push(`Niveau min: ${prerequisite.minimumLevel}`)
  }
  if (prerequisite.attributeMin) {
    const { attribute, value } = prerequisite.attributeMin
    lines.push(`${ATTRIBUTE_LABELS[attribute]} ≥ ${value}`)
  }

  return lines
}
