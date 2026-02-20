import { BookmarkPlus } from "lucide-react";
import { Button } from "./button";

const AnimeMobileAdd = () => {
  return (
    <Button size="icon" variant="outline" className="p-2 rounded-xs w-full tracking-wide text-muted-foreground" >
      <BookmarkPlus className="size-4 ml-2" /> Add to library 
    </Button>
  );
};

export default AnimeMobileAdd;