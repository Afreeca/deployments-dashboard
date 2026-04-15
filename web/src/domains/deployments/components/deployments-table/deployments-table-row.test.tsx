import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeploymentsTableRow } from "@/domains/deployments/components/deployments-table/deployments-table-row";
import { buildDeploymentListItem } from "@/test-helpers/deployments";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("DeploymentsTableRow", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("navigates to detail when the row is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeploymentsTableRow
        deployment={buildDeploymentListItem()}
        isSaving={false}
        onSave={jest.fn()}
      />,
    );

    await user.click(screen.getByRole("link"));

    expect(push).toHaveBeenCalledWith("/deployments/dep-001");
  });

  it("edits inline without navigating away", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <DeploymentsTableRow
        deployment={buildDeploymentListItem()}
        isSaving={false}
        onSave={onSave}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Edit checkout-api" }));
    await user.clear(screen.getByDisplayValue("checkout-api"));
    await user.type(screen.getByRole("textbox"), "checkout-api-v2");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(push).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledWith({ name: "checkout-api-v2" });
  });
});
