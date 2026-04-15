"use client";

import { useState } from "react";

import type {
  DeploymentListItem,
  UpdateDeploymentRequest,
} from "@/domains/deployments/types";

import styles from "./edit-deployment-form.module.scss";

type EditDeploymentFormProps = {
  deployment: DeploymentListItem;
  error: string | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (updateRequest: UpdateDeploymentRequest) => void;
};

export function EditDeploymentForm({
  deployment,
  error,
  isSaving,
  onCancel,
  onSubmit,
}: EditDeploymentFormProps) {
  const [name, setName] = useState(deployment.name);
  const [description, setDescription] = useState(deployment.description ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      description: description.trim() ? description.trim() : null,
      name: name.trim(),
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Name</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Description</span>
        <textarea
          className={styles.textarea}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>

        <button className={styles.primaryButton} type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
