from fastapi import APIRouter, HTTPException, Query, Response, status

from deployments.entities import (
    Deployment,
    DeploymentListItem,
    DeploymentListResponse,
    UpdateDeploymentAttributesRequest,
    UpdateDeploymentRequest,
)
from deployments.service import (
    delete_deployment_by_id,
    fetch_deployment_by_id,
    fetch_deployments,
    restore_deployment_by_id,
    update_deployment_attributes_by_id,
    update_deployment_by_id,
)
from deployments.enums import (
    DeploymentEnvironment,
    DeploymentStatus,
    DeploymentType,
    SortOrder,
    SortField,
)

router = APIRouter(prefix="/deployments", tags=["deployments"])


@router.get("", response_model=DeploymentListResponse)
def get_deployments(
    limit: int = Query(default=50, ge=1, le=500),
    cursor: str | None = Query(default=None),
    sort_by: SortField = Query(default="created_at"),
    sort_order: SortOrder = Query(default="desc"),
    status: DeploymentStatus | None = Query(default=None),
    deployment_type: DeploymentType | None = Query(default=None, alias="type"),
    environment: DeploymentEnvironment | None = Query(default=None),
) -> DeploymentListResponse:
    if cursor and sort_by != SortField.created_at:
        raise HTTPException(
            status_code=400,
            detail="Cursor pagination currently supports sort_by=created_at only.",
        )

    return fetch_deployments(
        limit=limit,
        cursor=cursor,
        sort_by=sort_by,
        sort_order=sort_order,
        status=status,
        deployment_type=deployment_type,
        environment=environment,
    )


@router.get("/{deployment_id}", response_model=Deployment)
def get_deployment_by_id(deployment_id: str) -> Deployment:
    deployment = fetch_deployment_by_id(deployment_id)

    if deployment is None:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    return deployment


@router.patch("/{deployment_id}", response_model=DeploymentListItem)
def patch_deployment_by_id(
    deployment_id: str,
    update_request: UpdateDeploymentRequest,
) -> DeploymentListItem:
    deployment = update_deployment_by_id(
        deployment_id=deployment_id,
        update_request=update_request,
    )

    if deployment is None:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    return deployment


@router.patch("/{deployment_id}/attributes", response_model=Deployment)
def patch_deployment_attributes_by_id(
    deployment_id: str,
    update_request: UpdateDeploymentAttributesRequest,
) -> Deployment:
    deployment = update_deployment_attributes_by_id(
        deployment_id=deployment_id,
        update_request=update_request,
    )

    if deployment is None:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    return deployment


@router.delete("/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deployment_by_id_route(deployment_id: str) -> Response:
    deleted = delete_deployment_by_id(deployment_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{deployment_id}/restore", response_model=Deployment)
def restore_deployment_by_id_route(deployment_id: str) -> Deployment:
    deployment = restore_deployment_by_id(deployment_id)

    if deployment is None:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    return deployment
