import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { createStore, type AppStore } from "./store";

type ProvidersProps = {
  children: ReactNode;
  store?: AppStore;
};

export function Providers({ children, store }: ProvidersProps) {
  const [appStore] = useState(() => store ?? createStore());
  return <Provider store={appStore}>{children}</Provider>;
}
