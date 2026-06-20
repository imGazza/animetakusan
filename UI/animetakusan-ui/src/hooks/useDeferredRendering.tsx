import { startTransition, useEffect, useState } from "react";

// Defers rendering of many elements that would slow down the initial render
const useDeferredRendering = (data: any) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!isReady && data) {
      startTransition(() => setIsReady(true));
      return;
    }
  }, [data, isReady]);

  return isReady;

}
export default useDeferredRendering;