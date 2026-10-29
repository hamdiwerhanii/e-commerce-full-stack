import type { AppConfig } from "@/types";
import { apiClient } from "./api.client";

export const configApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    appConfig: build.query<AppConfig, void>({
      query: () => "/config",
      providesTags: ["Config"],
    }),
  }),
});

export const { useAppConfigQuery } = configApi;
