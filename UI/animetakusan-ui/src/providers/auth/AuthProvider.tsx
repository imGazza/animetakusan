import type { LoginRequest } from "@/models/auth/LoginRequest";
import { useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApis } from "@/http/api/auth";
import { useNavigate } from "react-router";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const navigate = useNavigate();

  // Aggiungi expire time al backend sul token
  // Sistema e testa login google
  // Crea componente Sign Up
  // Controlla backend perchè non funziona add login

  // User info query
  const { data: userInfo, error, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: authApis.userInfo,
    staleTime: Infinity,
    retry: 2,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApis.login,
    onSuccess: () => {
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      refetchUser();
      navigate('/');
    },
    onError: () => {
      // TODO: Handle login error (e.g., show notification)
      console.log("error logging in");
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApis.logout,
    onSuccess: () => {
      localStorage.setItem('isAuthenticated', JSON.stringify(false));
      refetchUser();
      navigate('/login');
    },
    onError: () => { 
      //TODO: Handle logout error (e.g., show notification)
      console.log("error logging out");
    } 

  });

  const login = async (loginRequest: LoginRequest) => {
    console.log("Log func");
    await loginMutation.mutateAsync(loginRequest);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  if (error) {
    // redirect to 500 page, something is wrong with the server
  }

  const authInfo = useMemo(() => ({
    isAuthenticated: !!userInfo,
    user: userInfo ?? null,
    login: login,
    logout: logout,
  }), [userInfo]);
  
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};
export default AuthProvider;