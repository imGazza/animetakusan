import { useEffect } from "react";

const PageTitle = ({ text }: { text: string }) => {
    useEffect(() => {
        document.title = `${text} • Anime Takusan`;
    }, [text]);
    return null;
}
export default PageTitle;
