
const useSortMap = () => {

  const sortMap = {
    TrendingDesc: "Trending",
    PopularityDesc: "Popularity",
    ScoreDesc: "Average Score",
    TitleEnglish: "Title",
    StartDateDesc: "Start Date"
  }

  const getSortName = (sort: string) => {    
    return sortMap[sort as keyof typeof sortMap] ?? sort;
  }

  return { getSortName, sortMap };
}
export default useSortMap;