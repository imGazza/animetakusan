import { cn } from "@/lib/utils";

const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("container mx-auto px-2.5 md:px-6 m-inline py-6", className)}>
      {children}
    </div>
  )
}
export default Container;