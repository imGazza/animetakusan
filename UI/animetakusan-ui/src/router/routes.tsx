import Login from "@/features/auth/Login";
import LoginLayout from "@/features/auth/LoginLayout";
import Browse from "@/features/browse/Browse";
import AppLayout from "@/features/layout/AppLayout";
import RootLayout from "@/features/layout/RootLayout";
import AnimeDetail from "@/features/anime-detail/AnimeDetail";
import { createBrowserRouter, redirect } from "react-router";
import Library from "@/features/library/Library";
// Home is a work-in-progress prototype and not yet enabled in production.
// To preview it during development, uncomment this import and the /home route below.
// import Home from "@/features/home/Home";
import Settings from "@/features/profile/Settings";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import ErrorPage from "@/features/error/ErrorPage";
//import HomePreview from "@/features/home/HomePreview"; // TEMP preview

export const routes = createBrowserRouter([
    {
        path: "/",
        loader: () => redirect("/browse")
    },
    {
        Component: RootLayout,
        // Catches errors thrown by matched child routes/loaders. Unmatched URLs are handled
        // by the "*" catch-all below (a bare errorElement here does NOT catch a total no-match).
        errorElement: <ErrorPage variant="fullpage" />,
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
                // Unknown URL -> throw a 404 so ErrorPage renders (inside RootLayout's providers/theme)
                // instead of React Router's built-in fallback screen.
                path: "*",
                loader: () => { throw new Response("Not Found", { status: 404 }); },
                errorElement: <ErrorPage variant="fullpage" />
            },
            {
                Component: AppLayout,
                children: [
                    {
                        path: "/browse",
                        Component: Browse,
                        errorElement: <ErrorPage variant="scoped" />
                    },
                    // { path: "/home-preview", Component: HomePreview }, // TEMP preview
                    {
                        path: "/anime/:id",
                        Component: AnimeDetail,
                        errorElement: <ErrorPage variant="scoped" />
                    },
                    {
                        Component: ProtectedRoute,
                        children: [
                            // Home prototype — not production-ready. Uncomment (and its import above)
                            // to preview during development.
                            // {
                            //     path: "/home",
                            //     Component: Home,
                            //     errorElement: <ErrorPage variant="scoped" />
                            // },
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
