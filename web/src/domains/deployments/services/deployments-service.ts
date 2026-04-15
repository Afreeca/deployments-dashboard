import axios from "axios";

import type {
  Deployment,
  DeploymentList,
  DeploymentListItem,
  UpdateDeploymentRequest,
} from "@/domains/deployments/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDeployments(): Promise<DeploymentList> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  try {
    const response = await axios.get<DeploymentList>(
      `${API_BASE_URL}/deployments`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch deployments.");
  }
}

export async function fetchDeployment(id: string): Promise<Deployment> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  
  try {
    const response = await axios.get<Deployment>(
      `${API_BASE_URL}/deployments/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch {
    throw new Error("Failed to fetch deployments details");
  }
}

export async function updateDeployment(
  id: string,
  updateRequest: UpdateDeploymentRequest,
): Promise<DeploymentListItem> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  try {
    const response = await axios.patch<DeploymentListItem>(
      `${API_BASE_URL}/deployments/${id}`,
      updateRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch {
    throw new Error("Failed to update deployment");
  }
}
