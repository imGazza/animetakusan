import Login from "@/features/auth/Login";
import LoginLayout from "@/features/auth/LoginLayout";
import Browse from "@/features/browse/Browse";
import AppLayout from "@/features/layout/AppLayout";
import RootLayout from "@/features/layout/RootLayout";
import AnimeDetail from "@/features/anime-detail/AnimeDetail";
import { createBrowserRouter, redirect } from "react-router";
import Library from "@/features/library/Library";
import Settings from "@/features/profile/Settings";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import ErrorPage from "@/features/error/ErrorPage";

export const routes = createBrowserRouter([
    {
        path: "/",
        loader: () => redirect("/browse")
    },
    {
        Component: RootLayout,        
        errorElement: <ErrorPage variant="fullpage" />, // Catches everything not caught by child routes (expecially 404 on routes)
        children: [
            {
                path: "/login",
                Component: LoginLayout,
                children: [
                    {
                        index: true,
                        Component: Login
                    }
                ]
            },
            {                
                Component: AppLayout,
                children: [
                    {
                        path: "/browse",
                        Component: Browse,
                        errorElement: <ErrorPage variant="scoped" />
                    },
                    {
                        path: "/anime/:id",
                        Component: AnimeDetail,
                        errorElement: <ErrorPage variant="scoped" />
                    },
                    {
                        Component: ProtectedRoute,
                        children: [
                            {
                                path: "/library",
                                Component: Library,
                                errorElement: <ErrorPage variant="scoped" />
                            },
                            {
                                path: "/settings",
                                Component: Settings,
                                errorElement: <ErrorPage variant="scoped" />
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);
