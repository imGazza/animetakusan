import CustomToaster from "@/components/ui/custom-toaster";
import { Outlet } from "react-router";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLibraryQueryOptions } from "../library/queries";

const AppLayout = () => {

  // const queryClient = useQueryClient();
  // useEffect(() => {
  //   // Clear all queries on mount to ensure fresh data, especially after login/logout.
  //   queryClient.prefetchQuery(useLibraryQueryOptions());
  // }, [queryClient]);

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