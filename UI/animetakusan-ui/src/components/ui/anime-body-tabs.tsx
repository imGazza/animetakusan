import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import AnimeBodyRelations from "./anime-body-relations";
import AnimeBodyRecommendations from "./anime-body-recommendations";

const AnimeBodyTabs = ({ anime }: { anime: AnimeDetail }) => {
  return (
    <div className="border bg-muted">
      <Tabs className="gap-1" defaultValue="relations">
      <TabsList variant="line" className="w-full">
        <TabsTrigger className="text-xs tracking-widest uppercase" value="relations">Relations</TabsTrigger>
        <TabsTrigger className="text-xs tracking-widest uppercase" value="recommendations">Recommendations</TabsTrigger>
      </TabsList>
      <TabsContent value="relations" className="p-2">
        <AnimeBodyRelations anime={anime} />
      </TabsContent>
      <TabsContent value="recommendations" className="p-2">
        <AnimeBodyRecommendations anime={anime} />
      </TabsContent>
    </Tabs>
    </div>
  )
}
export default AnimeBodyTabs;