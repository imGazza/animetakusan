import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export const HomeSkeleton = () => (
  <Container className="flex flex-col gap-8">
    <div className="flex flex-col gap-3">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="mt-2 flex gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-20" />
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-44" />
      <div className="grid grid-cols-3 gap-3 md:flex md:gap-4 md:overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[37/53] rounded-sm md:w-[170px] md:shrink-0" />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Skeleton className="h-80 rounded-xs lg:col-span-2" />
      <Skeleton className="h-80 rounded-xs" />
    </div>
  </Container>
);

export default HomeSkeleton;
