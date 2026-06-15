export interface Treat {
  id: string;
  emoji: string;
  name: string;
  price: number;
}

export const TREATS: Treat[] = [
  { id: "cone", emoji: "🍦", name: "Soft Serve Cone", price: 3 },
  { id: "dipped", emoji: "🫕", name: "Dipped Cone", price: 4 },
  { id: "sundae", emoji: "🍨", name: "Sundae", price: 5 },
  { id: "pop", emoji: "🧊", name: "Bomb Pop", price: 2 },
  { id: "drumstick", emoji: "🥁", name: "Drumstick", price: 3 },
  { id: "sandwich", emoji: "🍪", name: "Ice Cream Sandwich", price: 3 },
  { id: "shake", emoji: "🥤", name: "Milkshake", price: 5 },
  { id: "float", emoji: "🫧", name: "Root Beer Float", price: 4 },
  { id: "banana", emoji: "🍌", name: "Banana Split", price: 6 },
  { id: "snow", emoji: "❄️", name: "Snow Cone", price: 3 },
  { id: "mochi", emoji: "🍡", name: "Mochi Ice Cream", price: 4 },
  { id: "cookie", emoji: "🥠", name: "Cookie Dough Bites", price: 3 },
];

export function getTreat(id: string): Treat | undefined {
  return TREATS.find((t) => t.id === id);
}
