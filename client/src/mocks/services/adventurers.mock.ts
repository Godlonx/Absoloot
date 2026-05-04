import type { AdventurerDto, AdventurerPayload } from "@/types"
import {
  getAdventurers,
  getAdventurer,
  createAdventurer as createAdventurerData,
  updateAdventurer as updateAdventurerData,
  deleteAdventurer as deleteAdventurerData,
} from "../data/adventurers"

export const list = async (): Promise<AdventurerDto[]> => {
  return getAdventurers()
}

export const get = async (id: string): Promise<AdventurerDto> => {
  const adventurer = getAdventurer(id)
  if (!adventurer) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }
  return adventurer
}

export const create = async (payload: AdventurerPayload): Promise<AdventurerDto> => {
  return createAdventurerData(payload)
}

export const update = async (
  id: string,
  payload: Partial<AdventurerPayload>
): Promise<AdventurerDto> => {
  const result = updateAdventurerData(id, payload)
  if (!result) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }
  return result
}

export const remove = async (id: string): Promise<void> => {
  const success = deleteAdventurerData(id)
  if (!success) {
    throw { status: 404, message: "Aventurier non trouvé" }
  }
}
