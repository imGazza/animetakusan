import CustomToaster from "@/components/ui/custom-toaster";
import { Outlet } from "react-router";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <Outlet />
        <CustomToaster />
      </main>
      <Footer />
    </div>
  )
}
export default AppLayout;