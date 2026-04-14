from datetime import datetime, timedelta, timezone

from fastapi import HTTPException

from deployments.repository import (
    delete_deployment,
    find_deleted_deployment_by_id,
    find_deployment_by_id,
    find_deployments,
    restore_deployment,
    update_deployment_attributes,
    update_deployment,
)
from deployments.entities import (
    Deployment,
    DeploymentListItem,
    DeploymentListResponse,
    UpdateDeploymentAttributesRequest,
    UpdateDeploymentRequest,
)
from deployments.enums import SortField, SortOrder


def fetch_deployments(
    limit: int,
    cursor: str | None,
    sort_by: SortField,
    sort_order: SortOrder,
) -> DeploymentListResponse:
    items, next_cursor, total = find_deployments(
        limit=limit,
        cursor=cursor,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return DeploymentListResponse(items=items, total=total, next_cursor=next_cursor)


def fetch_deployment_by_id(deployment_id: str) -> Deployment | None:
    return find_deployment_by_id(deployment_id)


def update_deployment_by_id(
    deployment_id: str,
    update_request: UpdateDeploymentRequest,
) -> DeploymentListItem | None:
    return update_deployment(deployment_id=deployment_id, update_request=update_request)


def update_deployment_attributes_by_id(
    deployment_id: str,
    update_request: UpdateDeploymentAttributesRequest,
) -> Deployment | None:
    return update_deployment_attributes(
        deployment_id=deployment_id,
        update_request=update_request,
    )


def delete_deployment_by_id(deployment_id: str) -> bool:
    return delete_deployment(deployment_id=deployment_id)


def restore_deployment_by_id(deployment_id: str) -> Deployment | None:
    deleted_deployment = find_deleted_deployment_by_id(deployment_id)

    if deleted_deployment is None:
        return None

    if deleted_deployment.deleted_at is None:
        return None

    restore_deadline = deleted_deployment.deleted_at + timedelta(days=30)
    if datetime.now(timezone.utc) > restore_deadline:
        raise HTTPException(
            status_code=400,
            detail="Deployment can only be restored within 30 days of deletion.",
        )

    return restore_deployment(deployment_id=deployment_id)
