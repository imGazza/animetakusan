import { Flower, Leaf, type LucideIcon, Snowflake, Sun } from "lucide-react";

export interface FilterSeasonOption {
  value: string;
  icon: LucideIcon;
  selectedColor: string;
}

export const FILTER_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

export const FILTER_FORMATS = [
  "TV",
  "Movie",
  "OVA",
  "ONA",
  "TV Short",
  "Special",
  "Music",
];

export const FILTER_STATUSES = [
  "Airing",
  "Finished",
  "Not Yet Released",
  "Cancelled",
];

export const FILTER_SEASONS: FilterSeasonOption[] = [
  { value: "Winter", icon: Snowflake, selectedColor: "#0DB3D9" },
  { value: "Spring", icon: Flower, selectedColor: "#df91d4" },
  { value: "Summer", icon: Sun, selectedColor: "#ffd900" },
  { value: "Fall", icon: Leaf, selectedColor: "#FF6347" },
];

const currentYear = new Date().getFullYear();

export const FILTER_YEARS = Array.from(
  { length: currentYear + 1 - 1990 + 1 },
  (_, index) => String(currentYear + 1 - index)
);