import type {
  CaptureOrderInput,
  CreateOrderInput,
  CreateOrderResponse,
  Order,
  OrderResponse,
  OrdersResponse,
  OrderStatus,
} from "@/types";
import { apiClient } from "./api.client";

const toOrder = (response: OrderResponse) => response.order;
const toOrders = (response: OrdersResponse) => response.orders;

export const ordersApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    myOrders: build.query<Order[], void>({
      query: () => "/orders",
      transformResponse: toOrders,
      providesTags: ["Orders"],
    }),
    myOrder: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: toOrder,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),
    createOrder: build.mutation<CreateOrderResponse, CreateOrderInput>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Orders", "Cart", "Products", "AdminOrders"],
    }),
    capturePayment: build.mutation<Order, CaptureOrderInput>({
      query: ({ orderId, paypalOrderId }) => ({
        url: `/orders/${orderId}/capture`,
        method: "POST",
        body: { paypalOrderId },
      }),
      transformResponse: toOrder,
      invalidatesTags: ["Orders", "Cart", "Products", "AdminOrders"],
    }),
    adminOrders: build.query<Order[], void>({
      query: () => "/admin/orders",
      transformResponse: toOrders,
      providesTags: ["AdminOrders"],
    }),
    adminOrder: build.query<Order, string>({
      query: (id) => `/admin/orders/${id}`,
      transformResponse: toOrder,
      providesTags: (_result, _error, id) => [{ type: "AdminOrders", id }],
    }),
    updateOrderStatus: build.mutation<Order, { id: string; orderStatus: OrderStatus }>({
      query: ({ id, orderStatus }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { orderStatus },
      }),
      transformResponse: toOrder,
      invalidatesTags: ["AdminOrders", "Orders"],
    }),
  }),
});

export const {
  useMyOrdersQuery,
  useMyOrderQuery,
  useCreateOrderMutation,
  useCapturePaymentMutation,
  useAdminOrdersQuery,
  useAdminOrderQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
