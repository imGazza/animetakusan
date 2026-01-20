import Login from "@/features/auth/Login";
import LoginLayout from "@/features/auth/LoginLayout";
import Browse from "@/features/home/Browse";
import AppLayout from "@/features/layout/AppLayout";
import RootLayout from "@/features/layout/RootLayout";
import { createBrowserRouter } from "react-router";

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
                path: "/",
                //errorElement: <ErrorPage />,
                Component: AppLayout,
                children: [
                    {
                        index: true,
                        Component: Browse
                    }
                ]
            }
        ]
    }
]);