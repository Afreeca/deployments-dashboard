from datetime import datetime, timedelta, timezone

import pytest
from fastapi import HTTPException

from deployments.entities import DeploymentListResponse
from deployments.enums import SortField, SortOrder
from deployments.service import fetch_deployments, restore_deployment_by_id
from tests.factories.deployments import build_deployment, build_deployment_list_item


def test_fetch_deployments_wraps_repository_result(monkeypatch: pytest.MonkeyPatch) -> None:
    items = [build_deployment_list_item()]

    def fake_find_deployments(**kwargs):
        assert kwargs["limit"] == 50
        assert kwargs["cursor"] is None
        assert kwargs["sort_by"] == SortField.created_at
        assert kwargs["sort_order"] == SortOrder.desc
        return items, "next-cursor", 1

    monkeypatch.setattr("deployments.service.find_deployments", fake_find_deployments)

    result = fetch_deployments(
        limit=50,
        cursor=None,
        sort_by=SortField.created_at,
        sort_order=SortOrder.desc,
        status=None,
        deployment_type=None,
        environment=None,
    )

    assert result == DeploymentListResponse(items=items, next_cursor="next-cursor", total=1)


def test_restore_deployment_by_id_raises_after_30_days(monkeypatch: pytest.MonkeyPatch) -> None:
    deleted_at = datetime.now(timezone.utc) - timedelta(days=31)
    deleted_deployment = build_deployment(deleted_at=deleted_at)

    monkeypatch.setattr(
        "deployments.service.find_deleted_deployment_by_id",
        lambda deployment_id: deleted_deployment,
    )

    with pytest.raises(HTTPException) as exc_info:
        restore_deployment_by_id("dep-001")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Deployment can only be restored within 30 days of deletion."


def test_restore_deployment_by_id_returns_restored_deployment(monkeypatch: pytest.MonkeyPatch) -> None:
    deleted_at = datetime.now(timezone.utc) - timedelta(days=5)
    deleted_deployment = build_deployment(deleted_at=deleted_at)
    restored_deployment = build_deployment(deleted_at=None)

    monkeypatch.setattr(
        "deployments.service.find_deleted_deployment_by_id",
        lambda deployment_id: deleted_deployment,
    )
    monkeypatch.setattr(
        "deployments.service.restore_deployment",
        lambda deployment_id: restored_deployment,
    )

    result = restore_deployment_by_id("dep-001")

    assert result == restored_deployment
