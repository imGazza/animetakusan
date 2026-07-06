// PREVIEW-ONLY route component — remove together with mock-preview.ts and the /home-preview route.
import HomeView from "./HomeView";
import { MOCK_LIBRARY } from "./mock-preview";

const HomePreview = () => <HomeView library={MOCK_LIBRARY} />;

export default HomePreview;
