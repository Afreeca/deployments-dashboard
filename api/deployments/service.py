from deployments.repository import find_deployments
from deployments.entities import DeploymentListResponse
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
