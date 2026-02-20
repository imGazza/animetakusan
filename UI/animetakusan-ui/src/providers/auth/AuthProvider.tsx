import type { LoginRequest } from "@/models/auth/LoginRequest";
import { useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { useLoginMutation, useLoginProviderMutation, useLogoutMutation, useSignupMutation, useUserQuery } from "./queries";
import type { RegisterRequest } from "@/models/auth/RegisterRequest";
import { useNavigate } from "react-router";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const navigate = useNavigate();

  const { data: userInfo, error, refetch: refetchUser } = useUserQuery();
  const loginMutation = useLoginMutation(refetchUser, navigate);
  const logoutMutation = useLogoutMutation(refetchUser, navigate);
  const loginProviderMutation = useLoginProviderMutation();
  const signupMutation = useSignupMutation();

  const login = useCallback((loginRequest: LoginRequest) => {
    loginMutation.mutate(loginRequest);
  }, [loginMutation]);

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const loginProvider = useCallback((provider: string) => {
    loginProviderMutation.mutate(provider);
  }, [loginProviderMutation]);

  const signUp = useCallback((registerRequest: RegisterRequest, callbackFn?: () => void) => {
    signupMutation.mutate(registerRequest, {
      onSuccess: () => {
        callbackFn?.();
      }
    });
  }, [signupMutation]);

  if (error) {
    // redirect to 500 page, something is wrong with the server
  }

  const authInfo = useMemo(() => ({
    isAuthenticated: !!userInfo,
    user: userInfo ?? null,
    login,
    loginProvider,
    logout,
    signUp,
  }), [userInfo, login, loginProvider, logout, signUp]);
  
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};
export default AuthProvider;