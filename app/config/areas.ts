export interface Area {
  id: string;
  name: string;
  short: string;
  desc: string;
  eta: number;
}

export const AREAS: Area[] = [
  {
    id: "cc-north",
    name: "Cedar City North",
    short: "CC North",
    desc: "North of Center St",
    eta: 10,
  },
  {
    id: "cc-south",
    name: "Cedar City South",
    short: "CC South",
    desc: "South of Center St",
    eta: 10,
  },
  {
    id: "cc-west",
    name: "Cedar City West",
    short: "CC West",
    desc: "West of Main St",
    eta: 12,
  },
  {
    id: "cc-east",
    name: "Cedar City East",
    short: "CC East",
    desc: "SUU / College area",
    eta: 10,
  },
  {
    id: "enoch",
    name: "Enoch",
    short: "Enoch",
    desc: "Enoch city limits",
    eta: 18,
  },
  {
    id: "kanarraville",
    name: "Kanarraville",
    short: "Kanarraville",
    desc: "South on I-15",
    eta: 22,
  },
  {
    id: "parowan",
    name: "Parowan",
    short: "Parowan",
    desc: "North on I-15",
    eta: 25,
  },
  {
    id: "summit",
    name: "Summit",
    short: "Summit",
    desc: "Between Cedar & Parowan",
    eta: 20,
  },
  {
    id: "brian-head",
    name: "Brian Head",
    short: "Brian Head",
    desc: "Up the canyon",
    eta: 35,
  },
  {
    id: "cedar-highlands",
    name: "Cedar Highlands",
    short: "Highlands",
    desc: "East bench area",
    eta: 15,
  },
];

export function getArea(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

export function getAreaETA(id: string): number {
  const area = getArea(id);
  return area?.eta || 15;
}
