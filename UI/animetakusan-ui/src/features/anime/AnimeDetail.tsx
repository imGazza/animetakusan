import { useAnimePageQuery } from "./queries";
import { useParams } from "react-router";
import AnimeHeader from "./AnimeHeader";

const AnimeDetail = () => {

  const { id } = useParams();
  const { data: anime, isLoading, error } = useAnimePageQuery(id ? parseInt(id) : 0);

  if(!anime) {
    return <div>Anime not found</div>
  }

  return (
    <>
      <AnimeHeader anime={anime} />
    </>
  )
}
export default AnimeDetail;