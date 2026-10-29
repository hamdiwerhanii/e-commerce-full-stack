import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth.api";
import type { AuthState } from "@/types";

const initialState: AuthState = { user: null, status: "unknown" };

const signedIn = isAnyOf(
  authApi.endpoints.me.matchFulfilled,
  authApi.endpoints.login.matchFulfilled,
  authApi.endpoints.register.matchFulfilled,
);

const signOut = (state: AuthState) => {
  state.user = null;
  state.status = "anonymous";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(signedIn, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addMatcher(authApi.endpoints.me.matchRejected, (state, action) => {
        if (!action.meta.condition) signOut(state);
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, signOut);
  },
});

export const authReducer = authSlice.reducer;
