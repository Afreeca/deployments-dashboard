import { act, renderHook } from "@testing-library/react";

import { useEditDeploymentAttributes } from "@/domains/deployments/hooks/use-edit-deployment-attributes";
import { buildDeployment } from "@/test-helpers/deployments";

describe("useEditDeploymentAttributes", () => {
  it("builds a remove payload when an optional attribute is removed", () => {
    const deployment = buildDeployment();
    const { result } = renderHook(() => useEditDeploymentAttributes(deployment));

    act(() => {
      result.current.handleRemoveAttribute("framework");
    });

    expect(result.current.updateRequest.remove).toContain("framework");
    expect(result.current.updateRequest.set.framework).toBeUndefined();
    expect(result.current.hasChanges).toBe(true);
  });

  it("adds an optional attribute and includes it in the set payload", () => {
    const deployment = buildDeployment({
      attributes: {
        description: null,
        framework: null,
        language: "python",
        name: "checkout-api",
        oncall: null,
        priority: null,
        region: null,
        team: "payments",
      },
    });

    const { result } = renderHook(() => useEditDeploymentAttributes(deployment));

    act(() => {
      result.current.setNextAttributeKey("framework");
    });

    act(() => {
      result.current.handleAddAttribute();
    });

    act(() => {
      result.current.handleDraftValueChange("framework", "fastapi");
    });

    expect(result.current.activeKeys).toContain("framework");
    expect(result.current.updateRequest.set.framework).toBe("fastapi");
    expect(result.current.hasChanges).toBe(true);
  });
});
