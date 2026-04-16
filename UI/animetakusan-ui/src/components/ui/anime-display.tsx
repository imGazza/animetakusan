import { cn } from "@/lib/utils";

const AnimeDisplay = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(className, "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5 lg:gap-12")}>
      {children}
    </div>
  )
}
export default AnimeDisplay;
