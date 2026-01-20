import CustomToaster from "@/components/ui/custom-toaster";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div>
      <header>
        
      </header>
      <main>
        <Outlet />
        <CustomToaster />
      </main>
      <footer>

      </footer>
    </div>
  )
}
export default AppLayout;