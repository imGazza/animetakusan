import { Leaf, Sun, Flower, Snowflake } from "lucide-react";
import MobileFilterPanel from "./mobile-filter-panel";
import DesktopFilterPanel from "./desktop-filter-panel";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";

const FilterPanel = ({ filter }: { filter: AnimeFilter | null }) => {
  
  const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"]
  const years = Array.from({ length: new Date().getFullYear() + 1 - 1990 + 1 }, (_, i) => String(new Date().getFullYear() + 1 - i));
  const yearsDesktop = [...years].reverse();
  const seasons = [
    { value: "Winter", icon: Snowflake, selectedColor: "#0DB3D9" }, 
    { value: "Spring", icon: Flower, selectedColor: "#df91d4" }, 
    { value: "Summer", icon: Sun, selectedColor: "#ffd900" }, 
    { value: "Fall", icon: Leaf, selectedColor: "#FF6347" }];
  const formats = ["TV", "Movie", "OVA", "ONA", "TV Short", "Special", "Music"];
  const airingStatuses = ["Airing", "Finished", "Not Yet Aired", "Cancelled"];

  const filtersOptions = { genres, years, seasons, formats, airingStatuses };

  return (
    <>
      <DesktopFilterPanel {...filtersOptions} years={yearsDesktop} filter={filter} />
      <MobileFilterPanel {...filtersOptions} filter={filter} />
    </>
  )
}
export default FilterPanel;