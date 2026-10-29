import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  useAddToCartMutation,
  useCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/api/cart.api";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getErrorMessage } from "@/shared/utils/error.utils";
import type { Cart } from "@/types";

const EMPTY_CART: Cart = { items: [], totalQuantity: 0, subtotal: 0 };

export function useCart() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading } = useCartQuery(undefined, { skip: !isAuthenticated });
  const [addRequest, addState] = useAddToCartMutation();
  const [updateRequest, updateState] = useUpdateCartItemMutation();
  const [removeRequest, removeState] = useRemoveCartItemMutation();

  const add = useCallback(
    async (productId: string, title: string, quantity = 1) => {
      if (!isAuthenticated) {
        toast.info("Sign in to add items to your cart");
        navigate("/auth/login", { state: { from: `${location.pathname}${location.search}` } });
        return;
      }
      try {
        await addRequest({ productId, quantity }).unwrap();
        toast.success(`${title} was added to your cart`);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [addRequest, isAuthenticated, location.pathname, location.search, navigate],
  );

  const setQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        await updateRequest({ productId, quantity }).unwrap();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [updateRequest],
  );

  const remove = useCallback(
    async (productId: string, title: string) => {
      try {
        await removeRequest(productId).unwrap();
        toast.success(`${title} was removed from your cart`);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    },
    [removeRequest],
  );

  return {
    cart: data ?? EMPTY_CART,
    isLoading,
    isUpdating: addState.isLoading || updateState.isLoading || removeState.isLoading,
    add,
    setQuantity,
    remove,
  };
}
