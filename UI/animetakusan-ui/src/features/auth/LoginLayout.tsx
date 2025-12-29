import CustomToaster from "@/components/ui/custom-toaster"
import { Outlet } from "react-router"

export default function LoginLayout() {

  return (
    <>
      <Outlet />
      <CustomToaster />
    </>
  )
}