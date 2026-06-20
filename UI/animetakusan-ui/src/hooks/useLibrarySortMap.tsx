
const useLibrarySortMap = () => {
  const sortMap = {
    Title: "Title",
    Score: "Personal Score",
    AverageScore: "Average Score",
    StartedDate: "Started Date",
    CompletedDate: "Completed Date",
    LastAdded: "Last Added"
  }

  const getSortName = (sort: string) => {
    return sortMap[sort as keyof typeof sortMap] ?? sort;
  }

  return { getSortName, sortMap };
}
export default useLibrarySortMap;