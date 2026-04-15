"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDeployment } from "@/domains/deployments/services/deployments-service";
import type { DeploymentList } from "@/domains/deployments/types";

export function useDeleteDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deploymentId: string) => deleteDeployment(deploymentId),
    onSuccess: (_, deploymentId) => {
      queryClient.setQueryData<DeploymentList | undefined>(
        ["deployments"],
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            items: currentData.items.filter(
              (deployment) => deployment.deployment_id !== deploymentId,
            ),
            total: Math.max(0, currentData.total - 1),
          };
        },
      );

      queryClient.removeQueries({
        queryKey: ["deployments", deploymentId],
      });

      queryClient.invalidateQueries({
        queryKey: ["deployments"],
      });
    },
  });
}
