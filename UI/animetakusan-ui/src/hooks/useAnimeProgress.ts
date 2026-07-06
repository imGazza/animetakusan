import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useAnimeEntryMutation } from "@/features/queries";
import type { Anime } from "@/models/common/Anime";

export const useAnimeProgress = (anime: Anime) => {
  const { mutate } = useAnimeEntryMutation();
  const [localProgress, setLocalProgress] = useState(anime.mediaListEntry?.progress ?? 0);

  const debouncedMutate = useDebouncedCallback((progress: number) => {
    if (!anime.mediaListEntry) return;

    const { createdAt: _, id: __, ...entry } = anime.mediaListEntry;
    const startedAt = new Date();

    mutate({
      ...entry,
      malId: anime.idMal,
      progress,
      status: progress >= 1 && anime.mediaListEntry.status === "PLANNING" ? "CURRENT" : null,
      startedAt: progress >= 1 && !anime.mediaListEntry.startedAt ? { day: startedAt.getDate(), month: startedAt.getMonth() + 1, year: startedAt.getFullYear() } : null,
    });
  }, 500);

  // Sync back to server value once mutation settles
  useEffect(() => {
    if (!anime.mediaListEntry) return;
    setLocalProgress(anime.mediaListEntry.progress ?? 0);
  }, [anime.mediaListEntry?.progress, anime.mediaListEntry]);

  // If the user navigates away mid-debounce, ensure the mutation is sent with the most recent value
  useEffect(() => () => { debouncedMutate.flush(); }, [debouncedMutate]);

  const isCaughtUp = localProgress === ((anime.nextAiringEpisode?.episode || 0) - 1);
  const displayProgress = anime.episodes ? (localProgress / anime.episodes) * 100 : 0;

  const handleProgressUpdate = () => {
    setLocalProgress(prev => {
      const next = prev + 1;
      debouncedMutate(next);
      return next;
    });
  };

  return { localProgress, handleProgressUpdate, isCaughtUp, displayProgress };
};
