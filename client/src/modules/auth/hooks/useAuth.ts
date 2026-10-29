import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { apiClient } from "@/api/api.client";
import { useLogoutMutation } from "@/api/auth.api";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useAppStore";
import { getErrorMessage } from "@/shared/utils/error.utils";

export function useAuth() {
  const { user, status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {
      await logoutRequest().unwrap();
      dispatch(apiClient.util.resetApiState());
      toast.success("You are signed out");
      navigate("/shop/home");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [dispatch, logoutRequest, navigate]);

  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    isAdmin: user?.role === "admin",
    logout,
  };
}
