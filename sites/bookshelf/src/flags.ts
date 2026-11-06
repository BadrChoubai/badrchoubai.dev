// Post-it arrow flag colours used to mark passages in the physical books,
// in dispenser order. Sampled from 3M's Assorted Primary Colors pack
export const flags = {
  red: "#ec4547",
  yellow: "#fde200",
  green: "#38c056",
  blue: "#0070c8",
  purple: "#cc4fbd",
} as const;

export type Flag = keyof typeof flags;
