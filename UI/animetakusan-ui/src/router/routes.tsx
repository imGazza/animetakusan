import Login from "@/features/auth/Login";
import LoginLayout from "@/features/auth/LoginLayout";
import Browse from "@/features/browse/Browse";
import AppLayout from "@/features/layout/AppLayout";
import RootLayout from "@/features/layout/RootLayout";
import AnimeDetail from "@/features/anime-detail/AnimeDetail";
import { createBrowserRouter } from "react-router";
import Library from "@/features/library/Library";
import Settings from "@/features/profile/Settings";

export const routes = createBrowserRouter([
    {
        Component: RootLayout,
        children: [
            {
                path: "/login",
                //errorElement: <ErrorPage />,
                Component: LoginLayout,
                children: [
                    {
                        index: true,
                        Component: Login
                    }
                ]
            },
            {
                path: "/browse",
                //errorElement: <ErrorPage />,
                Component: AppLayout,
                children: [
                    {
                        index: true,
                        Component: Browse
                    }
                ]
            },
            {
                path: "/anime/:id",
                //errorElement: <ErrorPage />,
                Component: AppLayout,
                children: [
                    {
                        index: true,
                        Component: AnimeDetail
                    }
                ]
            },
            {
                path: "/library",
                //errorElement: <ErrorPage />,
                Component: AppLayout,
                children: [
                    {
                        index: true,
                        Component: Library
                    }
                ]
            },
            {
                path: "/settings",
                //errorElement: <ErrorPage />,
                Component: AppLayout,
                children: [
                    {
                        index: true,
                        Component: Settings
                    }
                ]
            }
        ]
    }
]);