import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const AnimeAdd = ( { children, tooltipText }: { children?: React.ReactNode, tooltipText?: string } ) => {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side="left" className="hidden lg:block">
        <p>{tooltipText || "Add to library"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
export default AnimeAdd