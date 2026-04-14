from fastapi import APIRouter, HTTPException, Query

from deployments.entities import Deployment, DeploymentListResponse
from deployments.service import fetch_deployment_by_id, fetch_deployments
from deployments.enums import SortOrder, SortField

router = APIRouter(prefix="/deployments", tags=["deployments"])


@router.get("", response_model=DeploymentListResponse)
def get_deployments(
    limit: int = Query(default=50, ge=1, le=500),
    cursor: str | None = Query(default=None),
    sort_by: SortField = Query(default="created_at"),
    sort_order: SortOrder = Query(default="desc")
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
    )


@router.get("/{deployment_id}", response_model=Deployment)
def get_deployment_by_id(deployment_id: str) -> Deployment:
    deployment = fetch_deployment_by_id(deployment_id)

    if deployment is None:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    return deployment
