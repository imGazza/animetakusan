import { animeApis } from "@/http/api/anime";
import { useQuery } from "@tanstack/react-query";

export const useAnimePageQuery = (id: number) =>
  useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApis.animeDetail(id),
    staleTime: Infinity,
  });