import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "@/features/users/store/userStore";

/**
 * Syncs auth store user into the legacy userStore so Navbar/profile work.
 */
const AuthSyncProvider = () => {
  const authUser = useAuthStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    } else {
      // Clear userStore on logout
      setUser(null as any);
    }
  }, [authUser, setUser]);

  return null;
};

export default AuthSyncProvider;
