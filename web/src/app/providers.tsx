"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState } from "react";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [persister] = useState(() =>
    createAsyncStoragePersister({
      storage:
        typeof window !== "undefined"
          ? {
              getItem: async (key: string) => window.sessionStorage.getItem(key),
              removeItem: async (key: string) =>
                window.sessionStorage.removeItem(key),
              setItem: async (key: string, value: string) =>
                window.sessionStorage.setItem(key, value),
            }
          : undefined,
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: 1000 * 60 * 30,
        persister,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
