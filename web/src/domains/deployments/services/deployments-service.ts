import axios from "axios";

import type { DeploymentListResponse } from "@/domains/deployments/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDeployments(): Promise<DeploymentListResponse> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  try {
    const response = await axios.get<DeploymentListResponse>(
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
