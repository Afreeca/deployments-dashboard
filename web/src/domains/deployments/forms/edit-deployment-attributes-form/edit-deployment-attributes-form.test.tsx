import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EditDeploymentAttributesForm } from "@/domains/deployments/forms/edit-deployment-attributes-form/edit-deployment-attributes-form";
import { buildDeployment } from "@/test-helpers/deployments";

describe("EditDeploymentAttributesForm", () => {
  it("submits updated name and description as attribute changes", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <EditDeploymentAttributesForm
        deployment={buildDeployment()}
        error={null}
        isSaving={false}
        onSubmit={onSubmit}
      />,
    );

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "checkout-api-v2");

    await user.clear(screen.getByLabelText("Description"));
    await user.type(
      screen.getByLabelText("Description"),
      "Handles checkout orchestration",
    );

    await user.click(screen.getByRole("button", { name: "Save attributes" }));

    expect(onSubmit).toHaveBeenCalledWith({
      remove: [],
      set: {
        description: "Handles checkout orchestration",
        framework: "fastapi",
        language: "python",
        name: "checkout-api-v2",
        oncall: "payments-oncall",
        priority: "high",
        region: "eu-west-1",
        team: "payments",
      },
    });
  });
});
