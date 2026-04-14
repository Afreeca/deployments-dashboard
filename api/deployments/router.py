from fastapi import APIRouter, Query

from deployments.entities import DeploymentListResponse
from deployments.service import get_deployments

router = APIRouter(prefix="/deployments", tags=["deployments"])


@router.get("", response_model=DeploymentListResponse)
def list_deployments(limit: int = Query(default=50, ge=1, le=500)) -> DeploymentListResponse:
    return get_deployments(limit=limit)
