import { cn } from "@/lib/utils";
import { useState } from "react";

const AnimeImage = ({ url, title, onImageLoad, className }: { url: string, title: string, onImageLoad?: () => void, className?: string }) => {

  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={url}
      alt={title}
      loading="lazy"
      onLoad={() => { setLoaded(true); onImageLoad?.(); }}
      data-state={loaded ? 'loaded' : 'loading'}
      className={cn(`h-full w-full object-cover ${className}`)}
    />
  )
}
export default AnimeImage;