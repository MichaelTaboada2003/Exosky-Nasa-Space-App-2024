import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...classValue) {
  return twMerge(clsx(classValue));
}


