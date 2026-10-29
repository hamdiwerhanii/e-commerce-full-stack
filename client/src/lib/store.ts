import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiClient } from "@/api/api.client";
import { authReducer } from "@/modules/auth/store/authSlice";

const rootReducer = combineReducers({
  [apiClient.reducerPath]: apiClient.reducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiClient.middleware),
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
