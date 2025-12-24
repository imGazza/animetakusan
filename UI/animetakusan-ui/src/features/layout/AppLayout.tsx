import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  return (
    <div>
      <header>

      </header>
      <main>
        <Outlet />
        <Toaster />
      </main>
      <footer>

      </footer>
    </div>
  )
}
export default AppLayout;