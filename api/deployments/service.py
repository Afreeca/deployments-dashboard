from deployments.repository import find_deployments
from deployments.entities import DeploymentListResponse


def get_deployments(limit: int) -> DeploymentListResponse:
    items = find_deployments(limit=limit)
    return DeploymentListResponse(items=items, total=len(items))
