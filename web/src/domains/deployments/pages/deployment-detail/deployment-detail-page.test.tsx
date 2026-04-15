import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeploymentDetailPage } from "@/domains/deployments/pages/deployment-detail/deployment-detail-page";
import { buildDeployment } from "@/test-helpers/deployments";

const push = jest.fn();
const mutateDelete = jest.fn();

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

jest.mock("@/domains/deployments/hooks/use-deployment", () => ({
  useDeployment: () => ({
    data: buildDeployment(),
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/domains/deployments/hooks/use-update-deployment-attributes", () => ({
  useUpdateDeploymentAttributes: () => ({
    error: null,
    isPending: false,
    mutate: jest.fn(),
  }),
}));

jest.mock("@/domains/deployments/hooks/use-delete-deployment", () => ({
  useDeleteDeployment: () => ({
    error: null,
    isPending: false,
    mutate: mutateDelete,
  }),
}));

describe("DeploymentDetailPage", () => {
  beforeEach(() => {
    mutateDelete.mockReset();
    push.mockReset();
  });

  it("shows confirmation and deletes the deployment before redirecting", async () => {
    const user = userEvent.setup();

    mutateDelete.mockImplementation(
      (_deploymentId: string, options?: { onSuccess?: () => void }) => {
        options?.onSuccess?.();
      },
    );

    render(<DeploymentDetailPage deploymentId="dep-001" />);

    await user.click(
      screen.getByRole("button", { name: "Delete deployment" }),
    );

    expect(
      screen.getByText(/it will disappear from the dashboard/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Delete deployment" }),
    );

    expect(mutateDelete).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
  });
});
