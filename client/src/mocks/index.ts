export const isMockEnabled = (): boolean => {
  return import.meta.env.VITE_MOCK_API === "true"
}

export * as mockAuthService from "./services/auth.mock"
export * as mockAdventurersService from "./services/adventurers.mock"
export * as mockSkillsService from "./services/skills.mock"
export * as mockAdventurerSkillsService from "./services/adventurer-skills.mock"
