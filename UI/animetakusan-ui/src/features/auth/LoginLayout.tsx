import { useEffect } from "react"
import { Outlet } from "react-router"

export default function LoginLayout() {
  useEffect(() => {
    console.log("initialized LoginLayout")
  }, [])

  return <Outlet />
}