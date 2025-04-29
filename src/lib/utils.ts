import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBDTNumber = (number: number): string => {
  const numStr = number.toFixed(0); // Remove decimals for BDT style
  const len = numStr.length;

  if (len <= 3) return numStr;

  const lastThree = numStr.slice(-3);
  const remaining = numStr.slice(0, -3);
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${formattedRemaining},${lastThree}`;
};
