from fastapi.testclient import TestClient

from tests.factories.deployments import build_deployment, build_deployment_list_item


def test_get_deployments_rejects_cursor_with_non_created_at_sort(client: TestClient) -> None:
    response = client.get(
        "/deployments",
        params={
            "cursor": "2026-04-10T10:00:00+00:00|dep-001",
            "sort_by": "name",
        },
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Cursor pagination currently supports sort_by=created_at only."
    }


def test_get_deployment_by_id_returns_404_when_missing(
    client: TestClient,
    monkeypatch,
) -> None:
    monkeypatch.setattr("deployments.router.fetch_deployment_by_id", lambda deployment_id: None)

    response = client.get("/deployments/dep-missing")

    assert response.status_code == 404
    assert response.json() == {"detail": "Deployment not found."}


def test_patch_deployment_by_id_returns_updated_list_item(
    client: TestClient,
    monkeypatch,
) -> None:
    updated_item = build_deployment_list_item()

    monkeypatch.setattr(
        "deployments.router.update_deployment_by_id",
        lambda deployment_id, update_request: updated_item,
    )

    response = client.patch(
        "/deployments/dep-001",
        json={"name": "checkout-api"},
    )

    assert response.status_code == 200
    assert response.json()["deployment_id"] == "dep-001"
    assert response.json()["name"] == "checkout-api"


def test_restore_deployment_by_id_returns_restored_deployment(
    client: TestClient,
    monkeypatch,
) -> None:
    restored_deployment = build_deployment()

    monkeypatch.setattr(
        "deployments.router.restore_deployment_by_id",
        lambda deployment_id: restored_deployment,
    )

    response = client.post("/deployments/dep-001/restore")

    assert response.status_code == 200
    assert response.json()["deployment_id"] == "dep-001"
    assert response.json()["deleted_at"] is None
