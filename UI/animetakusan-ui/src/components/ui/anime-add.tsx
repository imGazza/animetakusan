import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const AnimeAdd = ( { children }: { children?: React.ReactNode } ) => {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
export default AnimeAdd