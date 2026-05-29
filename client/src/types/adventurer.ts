export const ADV_CLASSES = [
  "WARRIOR",
  "MAGE",
  "RANGER",
  "ROGUE",
  "CLERIC",
  "BARD",
  "DRUID",
  "PALADIN",
  "BARBARIAN",
  "MONK",
] as const;

export type AdvClass = (typeof ADV_CLASSES)[number];

export type AdventurerPayload = {
  name: string;
  level: number; // 1-100
  advClass: AdvClass;
  physical: number; // 1-50
  mental: number; // 1-50
  perception: number; // 1-50
  description?: string;
};

export type AdventurerDto = AdventurerPayload & {
  id: string;
};
