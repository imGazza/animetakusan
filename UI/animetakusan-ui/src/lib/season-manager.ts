const getSeasonFromMonth = (month: number): string => {
  if (month <= 3) return "Winter";
  if (month <= 6) return "Spring";
  if (month <= 9) return "Summer";
  return "Fall";
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
    Winter: "Spring", Spring: "Summer", Summer: "Fall", Fall: "Winter",
  };
  return seasons[getCurrentSeason()];
};

export const getNextSeasonYear = (): number => {
  return getCurrentSeason() === "Fall" ? getCurrentSeasonYear() + 1 : getCurrentSeasonYear();
};

export const getPreviousSeason = (): string => {
  const seasons: Record<string, string> = {
    Winter: "Fall", Spring: "Winter", Summer: "Spring", Fall: "Summer",
  };
  return seasons[getCurrentSeason()];
};

export const getPreviousSeasonYear = (): number => {
  return getCurrentSeason() === "Winter" ? getCurrentSeasonYear() - 1 : getCurrentSeasonYear();
};