import { Outlet } from "react-router"
import { Toaster } from "sonner"

export default function LoginLayout() {

  return (
    <>
      <Outlet />
      <Toaster position="top-center" richColors/>
    </>
  )
}