import { useState } from "react";

const AnimeCardImage = ({ url, title, onImageLoad }: { url: string, title: string, onImageLoad: () => void, className?: string }) => {

  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={url}
      alt={title}
      loading="lazy"
      onLoad={() => { setLoaded(true); onImageLoad(); }}
      data-state={loaded ? 'loaded' : 'loading'}
      className="h-full w-full duration-300 object-cover lg:group-hover:scale-[1.1] ease-in-out will-change-transform data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0"
    />
  )
}
export default AnimeCardImage;