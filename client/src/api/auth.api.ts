import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types";
import { apiClient } from "./api.client";

export const authApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: AuthResponse) => response.user,
      providesTags: ["Me"],
    }),
    login: build.mutation<User, LoginInput>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: AuthResponse) => response.user,
    }),
    register: build.mutation<User, RegisterInput>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: AuthResponse) => response.user,
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
});

export const { useMeQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
