import { cn } from "@/lib/utils";

const AnimeDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(className, "grid grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 lg:gap-12")}>
      {children}
    </div>
  )
}
export default AnimeDisplay;
