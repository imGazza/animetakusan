import { useAuth } from "@/hooks/useAuth";
import { useLibraryQuery } from "./queries";

const Library = () => {

  const { user } = useAuth();
  const { data: library, isLoading, error } = useLibraryQuery(user?.id ?? null);

  return (
    <div>{library?.lists[0]?.entries[0]?.anime?.title.english}</div>
  )
}
export default Library;