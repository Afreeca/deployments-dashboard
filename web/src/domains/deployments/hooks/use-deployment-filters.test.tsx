import { act, renderHook } from "@testing-library/react";

import { useDeploymentFilters } from "@/domains/deployments/hooks/use-deployment-filters";
import { buildDeploymentListItem } from "@/test-helpers/deployments";

describe("useDeploymentFilters", () => {
  it("searches across attribute values", () => {
    const deployments = [
      buildDeploymentListItem(),
      buildDeploymentListItem({
        attributes: {
          description: "Processes media",
          framework: "bullmq",
          language: "typescript",
          name: "media-worker",
          oncall: "media-oncall",
          priority: "medium",
          region: "us-east-1",
          team: "media",
        },
        created_by: "teammate",
        deployment_id: "dep-002",
        description: "Processes media",
        environment: "staging",
        name: "media-worker",
        status: "stopped",
        team: "media",
        type: "worker",
        updated_at: "2026-04-05T10:00:00Z",
      }),
    ];

    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.filters.setSearchTerm("bullmq");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
    expect(result.current.filteredDeployments[0].deployment_id).toBe("dep-002");
  });

  it("applies structured filters and sorting", () => {
    const deployments = [
      buildDeploymentListItem({
        deployment_id: "dep-001",
        environment: "production",
        name: "zeta-api",
        status: "active",
        type: "web_service",
        updated_at: "2026-04-10T09:30:00Z",
      }),
      buildDeploymentListItem({
        deployment_id: "dep-002",
        environment: "production",
        name: "alpha-worker",
        status: "active",
        type: "worker",
        updated_at: "2026-04-08T09:30:00Z",
      }),
      buildDeploymentListItem({
        deployment_id: "dep-003",
        environment: "staging",
        name: "beta-worker",
        status: "failed",
        type: "worker",
        updated_at: "2026-04-09T09:30:00Z",
      }),
    ];

    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.filters.setStatus("active");
      result.current.filters.setType("worker");
      result.current.filters.setEnvironment("production");
      result.current.filters.setSortKey("name_asc");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
    expect(result.current.filteredDeployments[0].deployment_id).toBe("dep-002");
  });
});
