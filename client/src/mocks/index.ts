export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_MOCK_API === "true"
}

export * as mockAuthService from "./services/auth.mock"
export * as mockAdventurersService from "./services/adventurers.mock"
export * as mockCompetencesService from "./services/competences.mock"
export * as mockAdventurerCompetencesService from "./services/adventurer-competences.mock"
