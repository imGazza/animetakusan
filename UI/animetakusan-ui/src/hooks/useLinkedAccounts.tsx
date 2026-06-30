import { platforms } from "@/features/profile/platforms";
import { useAuth } from "./useAuth";

const useLinkedAccounts = () => {
  const { user } = useAuth();

  const linkedAccounts = user?.linkedAccounts ?? [];
  const connectedCount = platforms.filter((p) => linkedAccounts.includes(p.key)).length;

  return { linkedAccounts, connectedCount };
}
export default useLinkedAccounts;