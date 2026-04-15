"use client";

import { useState } from "react";

import type { UpdateDeploymentRequest } from "@/domains/deployments/types";

import styles from "./editable-field-cell.module.scss";

type EditableFieldCellProps = {
  buildSaveRequest: (draftValue: string) => UpdateDeploymentRequest;
  canSave?: (draftValue: string) => boolean;
  className?: string;
  inputType?: "input" | "textarea";
  isSaving: boolean;
  onSave: (updateRequest: UpdateDeploymentRequest) => void;
  title?: string;
  value: string;
};

export function EditableFieldCell({
  buildSaveRequest,
  canSave,
  className,
  inputType = "input",
  isSaving,
  onSave,
  title,
  value,
}: EditableFieldCellProps) {
  const [draftValue, setDraftValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  function handleCancel() {
    setDraftValue(value);
    setIsEditing(false);
  }

  function handleSave() {
    onSave(buildSaveRequest(draftValue));
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className={`${styles.cell}${className ? ` ${className}` : ""}`}>
        {inputType === "textarea" ? (
          <textarea
            className={styles.editTextarea}
            data-editable-control
            disabled={isSaving}
            onChange={(event) => setDraftValue(event.target.value)}
            rows={3}
            value={draftValue}
          />
        ) : (
          <input
            className={styles.editInput}
            data-editable-control
            disabled={isSaving}
            onChange={(event) => setDraftValue(event.target.value)}
            value={draftValue}
          />
        )}

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            data-editable-control
            disabled={isSaving}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={styles.saveButton}
            data-editable-control
            disabled={isSaving || (canSave ? !canSave(draftValue) : false)}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.cell}${className ? ` ${className}` : ""}`} title={title ?? value}>
      <span className={styles.value}>{value}</span>
      <button
        aria-label={`Edit ${value}`}
        className={styles.editButton}
        data-edit-trigger
        data-editable-control
        onClick={() => setIsEditing(true)}
        type="button"
      >
        <svg aria-hidden="true" className={styles.editIcon} viewBox="0 0 24 24">
          <path
            d="M4 20L8.5 19L18.6 8.9C19.4 8.1 19.4 6.9 18.6 6.1L17.9 5.4C17.1 4.6 15.9 4.6 15.1 5.4L5 15.5L4 20Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>
    </div>
  );
}
