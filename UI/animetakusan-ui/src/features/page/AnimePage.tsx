import { useAnimePageQuery } from "./queries";
import { useParams } from "react-router";

const AnimePage = () => {

  const { id } = useParams();
  const { data: anime, isLoading, error } = useAnimePageQuery(id ? parseInt(id) : 0);

  return (
    <div className="p-4">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {anime && (
        <div>
          <h1>{anime.title.romaji}</h1>
          <img src={anime.coverImage.large} alt={anime.title.romaji} />
          <p>{anime.description}</p>
        </div>
      )}
    </div>
  )
}
export default AnimePage;