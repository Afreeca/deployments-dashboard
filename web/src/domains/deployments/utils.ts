import type { DeploymentListItem } from "@/domains/deployments/types";

export function formatDeploymentDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDeploymentType(value: DeploymentListItem["type"]) {
  return value.replaceAll("_", " ");
}

export function formatAttributeLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
