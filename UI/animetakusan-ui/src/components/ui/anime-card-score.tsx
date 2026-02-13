import { useMemo } from "react";

const AnimeCardScore = ({ score }: { score?: number }) => {

  const scoreColor = useMemo(() => {
      if (!score) return "";
      if (score >= 75) return "text-green-500";
      if (score >= 65) return "text-yellow-500";
      if (score >= 55) return "text-orange-500";
      if (score < 55) return "text-red-500";
      return "text-red-500";
    }, [score]);

  return (
    <span className={`${scoreColor} font-semibold`}>
      {score}%
    </span>
  )
}
export default AnimeCardScore;