import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {

  const {logout} = useAuth();

  return (
    <>
      <div>Home Page</div>
      <Button onClick={logout}>Logout</Button>
    </>
  )
}
export default Home;