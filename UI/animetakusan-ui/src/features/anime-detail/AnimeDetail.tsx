import { useAnimeDetailQuery } from "./queries";
import { useParams } from "react-router";
import AnimeHeader, { AnimeHeaderSkeleton } from "./AnimeHeader";
import AnimeBody from "./AnimeBody";
import Container from "@/components/ui/container";

const AnimeDetail = () => {

  const { id } = useParams();
  const { data: anime, isLoading } = useAnimeDetailQuery(id ? parseInt(id) : 0);

  if (isLoading || !anime) {
    return (
      <>
        <AnimeHeaderSkeleton />
      </>
    )
  }

  return (
    <>
      <AnimeHeader anime={anime} />
      <Container className="pt-4 md:pt-1 px-3">
        <AnimeBody anime={anime} />
      </Container>
    </>
  )
}
export default AnimeDetail;