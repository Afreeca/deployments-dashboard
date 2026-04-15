"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeployment } from "@/domains/deployments/services/deployments-service";
import type {
  DeploymentList,
  UpdateDeploymentRequest,
} from "@/domains/deployments/types";

type UpdateDeploymentArgs = {
  deploymentId: string;
  updateRequest: UpdateDeploymentRequest;
};

export function useUpdateDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deploymentId, updateRequest }: UpdateDeploymentArgs) =>
      updateDeployment(deploymentId, updateRequest),
    onSuccess: (updatedDeployment) => {
      queryClient.setQueryData<DeploymentList | undefined>(
        ["deployments"],
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            items: currentData.items.map((deployment) =>
              deployment.deployment_id === updatedDeployment.deployment_id
                ? updatedDeployment
                : deployment,
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["deployments", updatedDeployment.deployment_id],
      });
    },
  });
}
