import type { DetailedDate } from "@/models/common/Anime";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDurationFromSeconds(totalSeconds: number): { days: number; hours: number; minutes: number }{
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes };
}

export function calculateDurationFromMinutes(totalMinutes: number): { hours: number; minutes: number }{
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return { hours, minutes };
}

export function capitalize(value: string ): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function createDateFromDetails(detailedDate: DetailedDate | null): Date {
  if (!detailedDate) return new Date();
  const { year, month, day } = detailedDate;
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}