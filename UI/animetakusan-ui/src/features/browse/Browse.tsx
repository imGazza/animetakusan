import AnimePreview from "./AnimePreview";


const Browse = () => {
  return (
    <div className="container mx-auto px-2.5 md:px-6 m-inline py-6">
      <AnimePreview title="Trending" data={[]} />
    </div>
  )
}
export default Browse;