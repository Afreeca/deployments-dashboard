import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useDeleteDeployment } from "@/domains/deployments/hooks/use-delete-deployment";
import * as deploymentsService from "@/domains/deployments/services/deployments-service";
import { buildDeploymentListItem } from "@/test-helpers/deployments";

jest.mock("@/domains/deployments/services/deployments-service");

describe("useDeleteDeployment", () => {
  it("removes the deleted deployment from the cached list", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });

    queryClient.setQueryData(["deployments"], {
      items: [
        buildDeploymentListItem({ deployment_id: "dep-001" }),
        buildDeploymentListItem({ deployment_id: "dep-002", name: "worker-api" }),
      ],
      next_cursor: null,
      total: 2,
    });

    const deleteDeploymentMock = jest.mocked(deploymentsService.deleteDeployment);
    deleteDeploymentMock.mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteDeployment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync("dep-001");
    });

    expect(queryClient.getQueryData(["deployments"])).toEqual({
      items: [buildDeploymentListItem({ deployment_id: "dep-002", name: "worker-api" })],
      next_cursor: null,
      total: 1,
    });
  });
});
