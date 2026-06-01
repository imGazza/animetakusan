import type { DetailedDate } from "@/models/common/Anime";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (hours: number, minutes: number): string => {
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} min${minutes > 1 ? 's' : ''}`;
  return `${minutes} min${minutes > 1 ? 's' : ''}`;
};

export function calculateDurationFromSeconds(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return formatTimeRemaining(days, hours, minutes);
}

const formatTimeRemaining = (days: number, hours: number, minutes: number): string => {
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

export function calculateDurationFromMinutes(totalMinutes: number): { hours: number; minutes: number }{
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return { hours, minutes };
}

export function capitalize(value: string ): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function createDateFromDetails(detailedDate: DetailedDate | null): Date | null {
  if (!detailedDate) return null;
  const { year, month, day } = detailedDate;
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export const getScoreGradient = (score: number): string => {
  if (score >= 90) return "from-emerald-500 to-cyan-400"
  if (score >= 80) return "from-cyan-500 to-blue-400"
  if (score >= 75) return "from-blue-500 to-indigo-400"
  if (score >= 70) return "from-indigo-500 to-blue-400"
  if (score >= 40) return "from-orange-500 to-amber-400"
  if (score >= 30) return "from-rose-500 to-orange-400"
  return "from-red-600 to-rose-500"
}

export const getGlowColor = (score: number): string => {
  if (score >= 90) return "shadow-emerald-500/50"
  if (score >= 80) return "shadow-cyan-500/50"
  if (score >= 75) return "shadow-blue-500/50"
  if (score >= 70) return "shadow-indigo-500/50"
  if (score >= 40) return "shadow-orange-500/50"
  if (score >= 30) return "shadow-rose-500/50"
  return "shadow-red-500/50"
}

export const getRingColor = (score: number): string => {
  if (score >= 90) return "ring-emerald-500/50"
  if (score >= 80) return "ring-cyan-500/50"
  if (score >= 75) return "ring-blue-500/50"
  if (score >= 70) return "ring-indigo-500/50"
  if (score >= 40) return "ring-orange-500/50"
  if (score >= 30) return "ring-rose-500/50"
  return "ring-red-500/50"
}

export const scoreBadgeClass = (score: number) => {
  if (score >= 90) return "bg-gradient-to-br from-emerald-500/20 to-cyan-400/20 text-emerald-400 border-emerald-500/20";
  if (score >= 80) return "bg-gradient-to-br from-cyan-500/20 to-blue-400/20 text-cyan-400 border-cyan-500/20";
  if (score >= 75) return "bg-gradient-to-br from-blue-500/20 to-indigo-400/20 text-blue-400 border-blue-500/20";
  if (score >= 70) return "bg-gradient-to-br from-indigo-500/20 to-blue-400/20 text-indigo-400 border-indigo-500/20";
  if (score >= 40) return "bg-gradient-to-br from-orange-500/20 to-amber-400/20 text-orange-400 border-orange-500/20";
  if (score >= 30) return "bg-gradient-to-br from-rose-500/20 to-orange-400/20 text-rose-400 border-rose-500/20";
  return "bg-gradient-to-br from-red-600/20 to-rose-500/20 text-red-400 border-red-500/20";
};