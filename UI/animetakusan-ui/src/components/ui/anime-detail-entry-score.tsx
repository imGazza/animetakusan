import { cn, getGlowColor, getScoreGradient } from "@/lib/utils"
import { Slider } from "./slider"



const AnimeDetailEntryScore = ({ score, setScore }: { score: number, setScore: (score: number) => void }) => {

  const gradient = getScoreGradient(score)
  const glow = getGlowColor(score)

  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="text-muted-foreground text-sm">Personal Score</div>
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "self-center flex items-center justify-center w-20 h-8 rounded-xs bg-gradient-to-br transition-all duration-300",
            gradient,
            `shadow-md ${glow}`
          )}
        >
          <div className="rounded-xs flex items-center w-19 h-7 bg-muted justify-center">
            <span className="text-sm font-medium text-foreground">
              {score}
            </span>
          </div>
        </div>
        <Slider
          defaultValue={[75]}
          max={100}
          step={1}
          className="mx-auto w-full"
          rangeClassName={cn("bg-gradient-to-r", gradient)}
          value={[score]}
          onValueChange={(value) => setScore(value[0])}
        />
        <div className="flex gap-2 flex-wrap">
          {[10, 25, 50, 75, 90, 100].map((quickScore) => (
            <button
              key={quickScore}
              onClick={() => {
                setScore(quickScore)
              }}
              className={cn(
                "cursor-pointer px-4 py-1.5 text-xs font-medium rounded-xs transition-all duration-200",
                "bg-muted text-muted-foreground hover:bg-muted-foreground/20",
                score === quickScore && "ring-2 ring-primary ring-offset-1 ring-offset-background"
              )}
            >
              {quickScore}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AnimeDetailEntryScore;