import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Browse = () => {

  const {logout} = useAuth();

  return (
    <>
      <div>Browse Page</div>
      <Button onClick={logout}>Logout</Button>
    </>
  )
}
export default Browse;