"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDeployments } from "@/domains/deployments/services/deployments-service";

export function useDeployments() {
  const query = useQuery({
    queryKey: ["deployments"],
    queryFn: fetchDeployments,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
