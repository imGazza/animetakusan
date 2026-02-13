import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const AnimeCardSynopsis = ({ description }: { description: string }) => {

  if (!description) {
    return null;
  }

  return (
    <Accordion
      type="single"
      collapsible      
    >
      <AccordionItem value="synopsis">
        <AccordionTrigger className="text-muted-foreground text-md font-semibold tracking-wider">Synopsis</AccordionTrigger>
        <AccordionContent className="text-muted-foreground tracking-wider w-full">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
export default AnimeCardSynopsis;