import AnimeBodyProduction from "@/components/ui/anime-body-production";
import AnimeBodyProgress from "@/components/ui/anime-body-progress";
import AnimeBodyQuickInfo from "@/components/ui/anime-body-quickinfo";
import AnimeBodyRankings from "@/components/ui/anime-body-rankings";
import AnimeBodyRecommendations from "@/components/ui/anime-body-recommendations";
import AnimeBodyRelations from "@/components/ui/anime-body-relations";
import AnimeBodyReviews from "@/components/ui/anime-body-reviews";
import AnimeBodySynopsis from "@/components/ui/anime-body-synopsis";
import useMediaQuery, { DESKTOP_BREAKPOINT } from "@/hooks/useMediaQuery";
import type { AnimeDetail } from "@/models/common/AnimeDetail";

const AnimeBody = ({ anime }: { anime: AnimeDetail }) => {

  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  return (
    <>
      {
        isDesktop ?
          <div className="grid grid-cols-[300px_1fr] gap-4 items-start animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col gap-4">
              <AnimeBodyProgress anime={anime} />
              <AnimeBodyProduction anime={anime} />
              <AnimeBodyRankings anime={anime} />
            </div>
            <div className="flex flex-col gap-4">
              <AnimeBodyQuickInfo anime={anime} />
              <AnimeBodySynopsis description={anime.description} />
              <AnimeBodyRelations anime={anime} />
              <AnimeBodyRecommendations anime={anime} />
              <AnimeBodyReviews anime={anime} />
            </div>
          </div>
          :
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            <AnimeBodyQuickInfo anime={anime} />
            <AnimeBodyProgress anime={anime} />
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

// const AnimeBodySkeleton = () => {
//   const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

//   return (

//     isDesktop ? (
//       <div className="grid grid-cols-[300px_1fr] gap-4 items-start">
//         <div className="flex flex-col gap-4">
//           <Skeleton className="h-34 w-full rounded-xs" />   {/* Progress */}
//           <Skeleton className="h-80 w-full rounded-xs" />   {/* Production */}
//           <Skeleton className="h-40 w-full rounded-xs" />   {/* Rankings */}
//         </div>
//         <div className="flex flex-col gap-4">
//           <Skeleton className="h-22 w-full rounded-xs" />   {/* QuickInfo */}
//           <Skeleton className="h-40 w-full rounded-xs" />   {/* Synopsis */}
//           <Skeleton className="h-36 w-full rounded-xs" />   {/* Relations */}
//           <Skeleton className="h-36 w-full rounded-xs" />   {/* Recommendations */}
//           <Skeleton className="h-36 w-full rounded-xs" />   {/* Reviews */}
//         </div>
//       </div>
//     ) : (
//       <div className="flex flex-col gap-4">
//         <Skeleton className="h-21 w-full rounded-xs" />   {/* QuickInfo */}
//         <Skeleton className="h-32 w-full rounded-xs" />   {/* Progress */}
//         <Skeleton className="h-48 w-full rounded-xs" />   {/* Production */}
//         <Skeleton className="h-48 w-full rounded-xs" />   {/* Synopsis */}
//         <Skeleton className="h-48 w-full rounded-xs" />   {/* Relations */}
//         <Skeleton className="h-48 w-full rounded-xs" />   {/* Recommendations */}
//         <Skeleton className="h-48 w-full rounded-xs" />   {/* Reviews */}
//       </div>
//     )
//   );
// }
// export { AnimeBodySkeleton };