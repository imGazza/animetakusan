import AnimeCard from "@/components/ui/anime-card";
import type { Anime } from "@/models/common/Anime";

interface AnimePreviewProps {
  title: string;
  data: Anime[];
}

const AnimePreview = ({ title, data }: AnimePreviewProps) => {

  const mockAnime: Anime = {
    id: 185660,
    title: {
      english: "DAN DA DAN Season 2",
      romaji: "Dandadan 2nd Season",
      native: "ダンダダン 第2期"
    },
    coverImage: {
      extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx185660-uB8RUMBGovGr.jpg",
      large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx185660-uB8RUMBGovGr.jpg",
      color: "#f1ae28"
    },
    startDate: {
      year: 2025,
      month: 7,
      day: 4
    },
    endDate: {
      year: 2025,
      month: 9,
      day: 19
    },
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/185660-NdXFgzcYmcDz.jpg",
    season: "SUMMER",
    seasonYear: 2025,
    description: "The second season of <i>Dandadan</i>.<br><br> Okarun and Jiji have made a strange discovery, while Momo finds herself under attack! What mysterious encounters await them next?!<br><br>\n\n(Source: Netflix Anime Twitter)\n<br><br>\n<i>Notes: <br>\n- Worldwide premiere of Episodes 1-3 titled as <b>DAN DA DAN: EVIL EYE</b> before the Japanese premiere was pre-screened in advance in theaters on June 6, 2025 in North America by GKIDS Films and June 7 and 8 in Europe by Piece of Magic Entertainment and Animation Digital Network.</i>",
    type: "ANIME",
    format: "TV",
    status: "FINISHED",
    episodes: 12,
    duration: 24,
    genres: [
      "Action",
      "Comedy",
      "Drama",
      "Romance",
      "Sci-Fi",
      "Supernatural"
    ],
    isAdult: false,
    averageScore: 84,
    nextAiringEpisode: null as any,
    studios: {
      nodes: [
        {
          id: 6145,
          name: "Science SARU"
        }
      ]
    }
  };

  const displayData = data.length > 0 ? data : [mockAnime];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-md font-medium text-muted-foreground tracking-wider">
        {title}
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 lg:gap-12 py-4">
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[0]} />
      </div>
    </div>
  )
}
export default AnimePreview;