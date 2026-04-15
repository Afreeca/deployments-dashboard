"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDeployment } from "../services/deployments-service";

export function useDeployment(id: string) {
  const query = useQuery({
    queryKey: ["deployments", id],
    queryFn: () => fetchDeployment(id),
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
