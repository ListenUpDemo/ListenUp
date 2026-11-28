export type GearSlot = "potion" | "shield" | "sword";
export type Slot = GearSlot | "pet";

export interface AdventureItem {
  id: string;
  slot: Slot;
  name: string;
  rarity: string;
  unlockedAt: number;
  price: number;
  effect: number;
  durability?: number;
  repair?: number;
}

export const slots = ["potion", "shield", "sword", "pet"] as const;
export const slotLabels: Record<Slot, string> = {
  potion: "Đồ ăn",
  shield: "Từ điển",
  sword: "Sổ tay cụm từ",
  pet: "Bạn đồng hành",
};

export const items: readonly AdventureItem[] = [
  {
    id: "potion-1",
    slot: "potion",
    name: "Táo",
    rarity: "Phổ thông",
    unlockedAt: 0,
    price: 15,
    effect: 1,
  },
  {
    id: "potion-2",
    slot: "potion",
    name: "Sữa chua và granola",
    rarity: "Hiếm",
    unlockedAt: 1,
    price: 29,
    effect: 2,
  },
  {
    id: "potion-3",
    slot: "potion",
    name: "Bánh mì sandwich",
    rarity: "Sử thi",
    unlockedAt: 2,
    price: 42,
    effect: 3,
  },
  {
    id: "potion-4",
    slot: "potion",
    name: "Súp gà",
    rarity: "Huyền thoại",
    unlockedAt: 3,
    price: 55,
    effect: 4,
  },
  {
    id: "potion-5",
    slot: "potion",
    name: "Bữa trưa đầy đủ",
    rarity: "Thần thoại",
    unlockedAt: 4,
    price: 68,
    effect: 5,
  },
  {
    id: "shield-1",
    slot: "shield",
    name: "Từ điển bỏ túi",
    rarity: "Phổ thông",
    unlockedAt: 0,
    price: 105,
    effect: 1,
    durability: 2,
    repair: 18,
  },
  {
    id: "shield-2",
    slot: "shield",
    name: "Từ điển minh họa",
    rarity: "Hiếm",
    unlockedAt: 2,
    price: 190,
    effect: 1,
    durability: 4,
    repair: 28,
  },
  {
    id: "shield-3",
    slot: "shield",
    name: "Từ điển song ngữ",
    rarity: "Sử thi",
    unlockedAt: 4,
    price: 300,
    effect: 1,
    durability: 6,
    repair: 42,
  },
  {
    id: "sword-1",
    slot: "sword",
    name: "Sổ tay bỏ túi",
    rarity: "Phổ thông",
    unlockedAt: 0,
    price: 115,
    effect: 20,
    durability: 5,
    repair: 20,
  },
  {
    id: "sword-2",
    slot: "sword",
    name: "Sổ tay theo chủ đề",
    rarity: "Hiếm",
    unlockedAt: 2,
    price: 205,
    effect: 40,
    durability: 6,
    repair: 32,
  },
  {
    id: "sword-3",
    slot: "sword",
    name: "Sổ tay hội thoại",
    rarity: "Sử thi",
    unlockedAt: 4,
    price: 320,
    effect: 60,
    durability: 8,
    repair: 45,
  },
  {
    id: "cat-1",
    slot: "pet",
    name: "Mèo Hạt Dẻ",
    rarity: "Phổ thông",
    unlockedAt: 1,
    price: 70,
    effect: 0,
  },
  {
    id: "cat-2",
    slot: "pet",
    name: "Mèo Mây",
    rarity: "Phổ thông",
    unlockedAt: 1,
    price: 85,
    effect: 0,
  },
  {
    id: "cat-3",
    slot: "pet",
    name: "Mèo Mực",
    rarity: "Hiếm",
    unlockedAt: 2,
    price: 110,
    effect: 0,
  },
  {
    id: "cat-4",
    slot: "pet",
    name: "Mèo Sương",
    rarity: "Hiếm",
    unlockedAt: 2,
    price: 125,
    effect: 0,
  },
  {
    id: "cat-5",
    slot: "pet",
    name: "Mèo Nắng",
    rarity: "Sử thi",
    unlockedAt: 3,
    price: 155,
    effect: 0,
  },
  {
    id: "cat-6",
    slot: "pet",
    name: "Mèo Trăng",
    rarity: "Huyền thoại",
    unlockedAt: 4,
    price: 190,
    effect: 0,
  },
];

export const findItem = (id?: string) => items.find((item) => item.id === id);
