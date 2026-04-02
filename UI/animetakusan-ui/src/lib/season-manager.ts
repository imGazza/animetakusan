const getSeasonFromMonth = (month: number): string => {
  if (month <= 3) return "WINTER";
  if (month <= 6) return "SPRING";
  if (month <= 9) return "SUMMER";
  return "FALL";
};

export const getCurrentSeason = (): string => {
  return getSeasonFromMonth(new Date().getMonth() + 1);
};

export const getCurrentSeasonYear = (): number => {
  const date = new Date();
  return date.getMonth() + 1 === 12 ? date.getFullYear() + 1 : date.getFullYear();
};

export const getNextSeason = (): string => {
  const seasons: Record<string, string> = {
    WINTER: "SPRING", SPRING: "SUMMER", SUMMER: "FALL", FALL: "WINTER",
  };
  return seasons[getCurrentSeason()];
};

export const getNextSeasonYear = (): number => {
  return getCurrentSeason() === "FALL" ? getCurrentSeasonYear() + 1 : getCurrentSeasonYear();
};

export const getPreviousSeason = (): string => {
  const seasons: Record<string, string> = {
    WINTER: "FALL", SPRING: "WINTER", SUMMER: "SPRING", FALL: "SUMMER",
  };
  return seasons[getCurrentSeason()];
};

export const getPreviousSeasonYear = (): number => {
  return getCurrentSeason() === "WINTER" ? getCurrentSeasonYear() - 1 : getCurrentSeasonYear();
};