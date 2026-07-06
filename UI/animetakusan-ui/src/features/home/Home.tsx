import useLinkedAccounts from "@/hooks/useLinkedAccounts";
import AniListConnectCard from "@/features/library/AniListConnectCard";
import Container from "@/components/ui/container";
import { useLibraryQuery } from "@/features/library/queries";
import HomeView from "./HomeView";
import { HomeSkeleton } from "./HomeSkeleton";

const Home = () => {
  const { linkedAccounts } = useLinkedAccounts();
  const isAniListLinked = linkedAccounts.includes("AniList");
  const { data: library, isLoading } = useLibraryQuery(isAniListLinked);

  if (!isAniListLinked) {
    return (
      <Container>
        <AniListConnectCard />
      </Container>
    );
  }

  if (isLoading) return <HomeSkeleton />;

  return <HomeView library={library} />;
};

export default Home;
