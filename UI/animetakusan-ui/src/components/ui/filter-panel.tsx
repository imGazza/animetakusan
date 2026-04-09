import { Leaf, Sun, Flower, Snowflake } from "lucide-react";
import FilterRadio from "./filter-radio";
import FilterToggle from "./filter-toggle";
import FilterSeasons from "./filter-seasons";

const FilterPanel = () => {

  const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027","2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  const seasons = [
    { value: "Winter", icon: Snowflake, selectedColor: "#0DB3D9" }, 
    { value: "Spring", icon: Flower, selectedColor: "#df91d4" }, 
    { value: "Summer", icon: Sun, selectedColor: "#ffd900" }, 
    { value: "Fall", icon: Leaf, selectedColor: "#FF6347" }];
  const formats = ["TV", "Movie", "OVA", "ONA", "TV Short", "Special", "Music"];
  const airingStatuses = ["Airing", "Finished", "Not Yet Aired", "Cancelled"];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-col gap-4 md:w-1/2">
        <FilterToggle data={genres} title="Genres" />
        <FilterToggle data={formats} title="Format"  />
        <FilterRadio data={airingStatuses} title="Airing Status"  />
      </div>
      <div className="flex flex-col gap-4 md:w-1/2">
        <FilterSeasons data={seasons} title="Season" />        
        <FilterRadio data={[...years].reverse()} title="Year" />
      </div>
    </div>
  )
}
export default FilterPanel;