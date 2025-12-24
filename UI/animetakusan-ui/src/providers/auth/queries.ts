import { authApis } from "@/http/api/auth";
import { API_ENDPOINTS } from "@/http/api/common-endpoints";
import TokenManager from "@/lib/token-manager";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type NavigateFunction } from "react-router";
import { toast } from "sonner";

export const useUserQuery = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: authApis.userInfo,
    staleTime: Infinity,
    retry: 2,
    select: (data) => localStorage.setItem('isAuthenticated', JSON.stringify(!!data.id)),
  });

export const useLoginMutation = (refetchUser: () => void, navigate: NavigateFunction) =>
  useMutation({
    mutationFn: authApis.login,
    onSuccess: () => {
      refetchUser();
      TokenManager.clearToken();
      navigate('/');
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.data as string || "Error during login. Please try again.");
    }
  });

export const useLogoutMutation = (refetchUser: () => void, navigate: NavigateFunction) =>
  useMutation({
    mutationFn: authApis.logout,
    onSuccess: () => {
      TokenManager.clearToken();
      refetchUser();
      navigate('/login');
    },
    onError: () => {
      toast.error("Error during the logout process. Please try again.");
    }
  });

export const useLoginProviderMutation = () =>
  useMutation({
    mutationFn: async (provider: string) => {
      TokenManager.clearToken();
      window.location.href = `${API_ENDPOINTS.AUTH.PROVIDER}${provider}`;
      return { provider };
    }
  });

export const useSignupMutation = () =>
  useMutation({
    mutationFn: authApis.signUp,
    onSuccess: () => {
      TokenManager.clearToken();
      toast.success("Signup successful! You can now log in.");
    },
    onError: (error) => {
      toast.error(error.message || "Error during the signup process. Please try again.");
    }
  });
