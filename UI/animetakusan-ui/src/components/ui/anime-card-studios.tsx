
const AnimeCardStudios = ({ studios, color }: { studios: { nodes: { name: string }[] }, color: string }) => {
  if (!studios || studios.nodes.length === 0) {
    return null;
  }

  return (
    <div className="text-muted-foreground text-md xl:text-xs font-semibold line-clamp-2" style={{ color: color }}>
      {studios.nodes.map(studio => studio.name).join(", ")}
    </div>
  );
};
export default AnimeCardStudios;