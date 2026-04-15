"use client";

import type {
  Deployment,
  UpdateDeploymentAttributesRequest,
} from "@/domains/deployments/types";
import type { AttributeKey } from "@/domains/deployments/hooks/use-edit-deployment-attributes";
import { useEditDeploymentAttributes } from "@/domains/deployments/hooks/use-edit-deployment-attributes";
import { formatAttributeLabel } from "@/domains/deployments/utils";

import styles from "./edit-deployment-attributes-form.module.scss";

type EditDeploymentAttributesFormProps = {
  deployment: Deployment;
  error: string | null;
  isSaving: boolean;
  onSubmit: (updateRequest: UpdateDeploymentAttributesRequest) => void;
};

export function EditDeploymentAttributesForm({
  deployment,
  error,
  isSaving,
  onSubmit,
}: EditDeploymentAttributesFormProps) {
  const {
    activeKeys,
    availableOptionalKeys,
    draftValues,
    handleAddAttribute,
    handleDraftValueChange,
    handleRemoveAttribute,
    hasChanges,
    hasInvalidRequiredField,
    isRequiredAttribute,
    nextAttributeKey,
    setNextAttributeKey,
    updateRequest,
  } = useEditDeploymentAttributes(deployment);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        if (!hasInvalidRequiredField && hasChanges) {
          onSubmit(updateRequest);
        }
      }}
    >
      <div className={styles.rows}>
        {activeKeys.map((key) => {
          const isRequired = isRequiredAttribute(key);

          return (
            <div className={styles.row} key={key}>
              <div className={styles.rowHeader}>
                <label className={styles.fieldLabel} htmlFor={`attribute-${key}`}>
                  {formatAttributeLabel(key)}
                </label>
                {!isRequired ? (
                  <button
                    className={styles.removeButton}
                    disabled={isSaving}
                    onClick={() => handleRemoveAttribute(key)}
                    type="button"
                  >
                    Remove
                  </button>
                ) : (
                  <span className={styles.requiredBadge}>Required</span>
                )}
              </div>

              <input
                className={styles.input}
                disabled={isSaving}
                id={`attribute-${key}`}
                onChange={(event) => handleDraftValueChange(key, event.target.value)}
                value={draftValues[key]}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.addRow}>
        <div className={styles.addField}>
          <label className={styles.fieldLabel} htmlFor="attribute-select">
            Add attribute
          </label>
          <div className={styles.addControls}>
            <select
              className={styles.select}
              disabled={isSaving || availableOptionalKeys.length === 0}
              id="attribute-select"
              onChange={(event) => setNextAttributeKey(event.target.value as AttributeKey | "")}
              value={nextAttributeKey}
            >
              <option value="">
                {availableOptionalKeys.length === 0
                  ? "All known attributes are already shown"
                  : "Select an attribute"}
              </option>
              {availableOptionalKeys.map((key) => (
                <option key={key} value={key}>
                  {formatAttributeLabel(key)}
                </option>
              ))}
            </select>
            <button
              className={styles.addButton}
              disabled={isSaving || !nextAttributeKey}
              onClick={handleAddAttribute}
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          disabled={isSaving || hasInvalidRequiredField || !hasChanges}
          type="submit"
        >
          {isSaving ? "Saving..." : "Save attributes"}
        </button>
      </div>
    </form>
  );
}
