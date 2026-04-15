"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeploymentAttributes } from "@/domains/deployments/services/deployments-service";
import type {
  Deployment,
  DeploymentList,
  UpdateDeploymentAttributesRequest,
} from "@/domains/deployments/types";

type UpdateDeploymentAttributesArgs = {
  deploymentId: string;
  updateRequest: UpdateDeploymentAttributesRequest;
};

export function useUpdateDeploymentAttributes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deploymentId, updateRequest }: UpdateDeploymentAttributesArgs) =>
      updateDeploymentAttributes(deploymentId, updateRequest),
    onSuccess: (updatedDeployment) => {
      queryClient.setQueryData<Deployment>(
        ["deployments", updatedDeployment.deployment_id],
        updatedDeployment,
      );

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
                ? {
                    ...deployment,
                    attributes: updatedDeployment.attributes,
                    created_at: updatedDeployment.created_at,
                    created_by: updatedDeployment.created_by,
                    description: updatedDeployment.attributes.description,
                    environment: updatedDeployment.environment,
                    name: updatedDeployment.attributes.name,
                    status: updatedDeployment.status,
                    team: updatedDeployment.attributes.team,
                    type: updatedDeployment.type,
                    updated_at: updatedDeployment.updated_at,
                    version: updatedDeployment.version,
                  }
                : deployment,
            ),
          };
        },
      );
    },
  });
}
