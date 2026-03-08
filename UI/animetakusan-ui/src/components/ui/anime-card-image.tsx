import { useCallback, useEffect, useRef, useState } from "react";

const AnimeCardImage = ({ url, title, onImageLoad, className }: { url: string, title: string, onImageLoad: () => void, className?: string }) => {

  const [src, setSrc] = useState<string | null>(null);
  const containerRef = useRef(null);

  const imageLoaded = useCallback(() => {
    setSrc(url);
    onImageLoad();
  }, [onImageLoad]);

  useEffect(() => {
    // Observer declaration, triggered by the browser when the observed object enters the viewport
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Create a memory image, not in the DOM
        const img = new Image();
        img.src = url;
        // On image load, the url gets added to the state and the real image loads in the DOM
        img.onload = imageLoaded;
        // The observation is not needed anymore, image is loaded
        observer.disconnect();
      }
    });

    // Start observing the container of the image
    if (containerRef.current) observer.observe(containerRef.current);

    // Cleanup
    return () => observer.disconnect();
  }, [url, imageLoaded]);

  return (
    <div ref={containerRef} data-state={src ? 'loaded' : 'loading'} className={`h-full w-full duration-300 ease-in-out data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0`} >
      {src && <img
        src={src}
        alt={title}
        className={className}
      />}
    </div>
  )
}
export default AnimeCardImage;