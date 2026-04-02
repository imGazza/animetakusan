import { cn } from "@/lib/utils";

const AnimeDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(className, "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5 lg:gap-12 py-2 md:py-4")}>
      {children}
    </div>
  )
}
export default AnimeDisplay;
