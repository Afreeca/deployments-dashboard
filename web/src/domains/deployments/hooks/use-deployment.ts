"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDeployment } from "../services/deployments-service";

export function useDeployment(id: string) {
    const query = useQuery({
      queryKey: ["deployments", id],
      queryFn: () => fetchDeployment(id),
      enabled: Boolean(id),
    });

   return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };

}