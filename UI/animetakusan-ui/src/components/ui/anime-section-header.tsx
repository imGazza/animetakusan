import useFilter from "@/hooks/useFilter";

const AnimeSectionHeader = ({ title, filterName }: { title: string, filterName: string }) => {
  const { applyPresetFilter } = useFilter();  

  return (
    <div className="flex justify-between items-center">
      <div className="text-md font-semibold text-muted-foreground tracking-wider">
        {title}
      </div>
      <div 
          className="text-xs font-semibold text-muted-foreground tracking-wider hover:text-muted-foreground/80 cursor-pointer"
          onClick={() => applyPresetFilter(filterName)}
        >
          View All
      </div>
    </div>
  )
}
export default AnimeSectionHeader;