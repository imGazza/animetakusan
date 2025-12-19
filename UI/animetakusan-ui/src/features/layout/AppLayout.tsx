import { Outlet } from "react-router";
import Login from "../auth/Login";

const AppLayout = () => {
  return (
    <div>
      <header>

      </header>
      <main>
        <Outlet />
      </main>
      <footer>

      </footer>
    </div>
  )
}
export default AppLayout;