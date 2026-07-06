import CustomToaster from "@/components/ui/custom-toaster";
import { Outlet } from "react-router";
import Header from "../../components/ui/header";
import Footer from "../../components/ui/footer";
import BottomNav from "@/components/ui/bottom-nav";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLibraryQueryOptions } from "../library/queries";
import useLinkedAccounts from "@/hooks/useLinkedAccounts";

const AppLayout = () => {

  const queryClient = useQueryClient();
  const { linkedAccounts } = useLinkedAccounts();
  const isAniListLinked = linkedAccounts.includes("AniList");
  const libraryQueryOptions = useLibraryQueryOptions();

  useEffect(() => {
    // Clear all queries on mount to ensure fresh data, especially after login/logout.
    if (!isAniListLinked) return;
    queryClient.prefetchQuery(libraryQueryOptions);
  }, [queryClient, isAniListLinked, libraryQueryOptions]);

  return (
    <div className="pb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom))] lg:pb-0">
      <Header />
      <main className="min-h-screen">
        <Outlet />
        <CustomToaster />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
export default AppLayout;