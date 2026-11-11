"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createProductStore, type ProductStore } from "./product-store";

type ProductStoreApi = ReturnType<typeof createProductStore>;
const ProductStoreContext = createContext<ProductStoreApi | null>(null);

export function ProductStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createProductStore);
  return <ProductStoreContext.Provider value={store}>{children}</ProductStoreContext.Provider>;
}

export function useProductStoreApi() {
  const store = useContext(ProductStoreContext);
  if (!store) throw new Error("Product components must be inside ProductStoreProvider.");
  return store;
}

export function useProductStore<T>(selector: (state: ProductStore) => T): T {
  return useStore(useProductStoreApi(), selector);
}
