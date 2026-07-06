import AnimeBodyProduction from "@/components/ui/anime-body-production";
import AnimeBodyProgress from "@/components/ui/anime-body-progress";
import AnimeBodyPopularity from "@/components/ui/anime-body-popularity";
import AnimeBodyRankings from "@/components/ui/anime-body-rankings";
import AnimeBodyRecommendations from "@/components/ui/anime-body-recommendations";
import AnimeBodyRelations from "@/components/ui/anime-body-relations";
import AnimeBodyReviews from "@/components/ui/anime-body-reviews";
import AnimeBodySynopsis from "@/components/ui/anime-body-synopsis";
import useMediaQuery, { DESKTOP_BREAKPOINT } from "@/hooks/useMediaQuery";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const AnimeBody = ({ anime }: { anime: AnimeDetail }) => {

  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const { isAuthenticated } = useAuth();

  return (
    <>
      {
        isDesktop ?
          <div className="grid grid-cols-[300px_1fr] gap-4 items-start animate-in fade-in duration-500">
            <div className="flex flex-col gap-4">
              {isAuthenticated && <AnimeBodyProgress anime={anime} />}
              <AnimeBodyProduction anime={anime} />
              <AnimeBodyRankings anime={anime} />
            </div>
            <div className="flex flex-col gap-4">
              <AnimeBodyPopularity anime={anime} />
              <AnimeBodySynopsis description={anime.description} />
              <AnimeBodyRelations anime={anime} />
              <AnimeBodyRecommendations anime={anime} />
              <AnimeBodyReviews anime={anime} />
            </div>
          </div>
          :
          <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            <AnimeBodyPopularity anime={anime} />
            {isAuthenticated && <AnimeBodyProgress anime={anime} />}
            <AnimeBodyProduction anime={anime} />
            <AnimeBodySynopsis description={anime.description} />
            <AnimeBodyRelations anime={anime} />
            <AnimeBodyRecommendations anime={anime} />
            <AnimeBodyRankings anime={anime} />
            <AnimeBodyReviews anime={anime} />
          </div>
      }
    </>
  );
}
export default AnimeBody;

const StatsRowSkeleton = () => (
  <div className="flex gap-2 w-full">
    <Skeleton className="h-[76px] flex-1 rounded-xs" />
    <Skeleton className="h-[76px] flex-1 rounded-xs" />
    <Skeleton className="h-[76px] flex-1 rounded-xs" />
  </div>
);

const AnimeBodySkeleton = () => {

  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  return (
    isDesktop ? (
      <div className="grid grid-cols-[300px_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-44 w-full rounded-xs" />
          <Skeleton className="h-56 w-full rounded-xs" />
          <Skeleton className="h-40 w-full rounded-xs" />
        </div>
        <div className="flex flex-col gap-4">
          <StatsRowSkeleton />
          <Skeleton className="h-40 w-full rounded-xs" />
          <Skeleton className="h-52 w-full rounded-xs" />
          <Skeleton className="h-52 w-full rounded-xs" />
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        <StatsRowSkeleton />
        <Skeleton className="h-32 w-full rounded-xs" />
        <Skeleton className="h-40 w-full rounded-xs" />
        <Skeleton className="h-52 w-full rounded-xs" />
        <Skeleton className="h-52 w-full rounded-xs" />
      </div>
    )
  );
}
export { AnimeBodySkeleton };