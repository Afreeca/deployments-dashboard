"use client";

import { useMemo, useState } from "react";

import type {
  Deployment,
  DeploymentAttributes,
  UpdateDeploymentAttributesRequest,
} from "@/domains/deployments/types";

const requiredAttributeKeys = ["name", "team"] as const;
const optionalAttributeKeys = [
  "description",
  "region",
  "language",
  "framework",
  "priority",
  "oncall",
] as const;
const allAttributeKeys = [...requiredAttributeKeys, ...optionalAttributeKeys] as const;

export type AttributeKey = keyof DeploymentAttributes;

function buildInitialValues(attributes: DeploymentAttributes) {
  return allAttributeKeys.reduce<Record<AttributeKey, string>>((accumulator, key) => {
    accumulator[key] = attributes[key] ?? "";
    return accumulator;
  }, {} as Record<AttributeKey, string>);
}

function buildInitialActiveKeys(attributes: DeploymentAttributes) {
  return allAttributeKeys.filter((key) =>
    requiredAttributeKeys.includes(key as (typeof requiredAttributeKeys)[number])
      ? true
      : Boolean(attributes[key]),
  );
}

function buildOriginalSet(attributes: DeploymentAttributes) {
  return allAttributeKeys.reduce<Record<string, string>>((accumulator, key) => {
    const value = attributes[key];

    if (
      requiredAttributeKeys.includes(
        key as (typeof requiredAttributeKeys)[number],
      ) ||
      value
    ) {
      accumulator[key] = value ?? "";
    }

    return accumulator;
  }, {});
}

export function useEditDeploymentAttributes(deployment: Deployment) {
  const [activeKeys, setActiveKeys] = useState<Array<AttributeKey>>(
    buildInitialActiveKeys(deployment.attributes),
  );
  const [draftValues, setDraftValues] = useState<Record<AttributeKey, string>>(
    buildInitialValues(deployment.attributes),
  );
  const [nextAttributeKey, setNextAttributeKey] = useState<AttributeKey | "">("");

  const availableOptionalKeys = useMemo(
    () => optionalAttributeKeys.filter((key) => !activeKeys.includes(key)),
    [activeKeys],
  );

  const updateRequest = useMemo<UpdateDeploymentAttributesRequest>(() => {
    const set: Record<string, string> = {};
    const remove: string[] = [];

    allAttributeKeys.forEach((key) => {
      const isRequired = requiredAttributeKeys.includes(
        key as (typeof requiredAttributeKeys)[number],
      );
      const isActive = activeKeys.includes(key);
      const originalValue = deployment.attributes[key];
      const nextValue = draftValues[key].trim();

      if (isRequired) {
        set[key] = nextValue;
        return;
      }

      if (isActive && nextValue) {
        set[key] = nextValue;
        return;
      }

      if (originalValue) {
        remove.push(key);
      }
    });

    return { remove, set };
  }, [activeKeys, deployment.attributes, draftValues]);

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(updateRequest.set) !==
        JSON.stringify(buildOriginalSet(deployment.attributes)) ||
      updateRequest.remove.length > 0
    );
  }, [deployment.attributes, updateRequest.remove.length, updateRequest.set]);

  const hasInvalidRequiredField = requiredAttributeKeys.some(
    (key) => !draftValues[key].trim(),
  );

  function handleAddAttribute() {
    if (!nextAttributeKey) {
      return;
    }

    setActiveKeys((currentKeys) =>
      allAttributeKeys.filter(
        (key) => currentKeys.includes(key) || key === nextAttributeKey,
      ),
    );
    setNextAttributeKey("");
  }

  function handleDraftValueChange(key: AttributeKey, value: string) {
    setDraftValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  function handleRemoveAttribute(key: AttributeKey) {
    if (requiredAttributeKeys.includes(key as (typeof requiredAttributeKeys)[number])) {
      return;
    }

    setActiveKeys((currentKeys) =>
      currentKeys.filter((currentKey) => currentKey !== key),
    );
    handleDraftValueChange(key, "");
  }

  return {
    activeKeys,
    availableOptionalKeys,
    draftValues,
    hasChanges,
    hasInvalidRequiredField,
    nextAttributeKey,
    setNextAttributeKey,
    updateRequest,
    handleAddAttribute,
    handleDraftValueChange,
    handleRemoveAttribute,
    isRequiredAttribute: (key: AttributeKey) =>
      requiredAttributeKeys.includes(key as (typeof requiredAttributeKeys)[number]),
  };
}
