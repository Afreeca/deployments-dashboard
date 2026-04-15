from datetime import datetime, timezone

from pymongo import ReturnDocument

from deployments.entities import (
    Deployment,
    DeploymentListItem,
    UpdateDeploymentAttributesRequest,
    UpdateDeploymentRequest,
)
from database.collections import deployments_collection
from deployments.enums import (
    DeploymentEnvironment,
    DeploymentStatus,
    DeploymentType,
    SortField,
    SortOrder,
)

SORT_FIELD_MAP = {
    SortField.created_at: "created_at",
    SortField.name: "attributes.name",
    SortField.status: "status",
    SortField.type: "type",
    SortField.environment: "environment",
    SortField.created_by: "created_by",
}

SORT_ORDER_MAP = {
    SortOrder.asc: 1,
    SortOrder.desc: -1,
}


def _parse_cursor(cursor: str) -> tuple[datetime, str]:
    created_at_raw, deployment_id = cursor.split("|", 1)
    created_at = datetime.fromisoformat(created_at_raw.replace("Z", "+00:00"))

    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    return created_at, deployment_id


def _build_cursor_filter(cursor: str, sort_order: SortOrder) -> dict:
    created_at, deployment_id = _parse_cursor(cursor)

    if sort_order == SortOrder.asc:
        comparison_operator = "$gt"
    else:
        comparison_operator = "$lt"

    return {
        "$or": [
            {"created_at": {comparison_operator: created_at}},
            {
                "created_at": created_at,
                "deployment_id": {comparison_operator: deployment_id},
            },
        ]
    }


def _build_next_cursor(items: list[Deployment]) -> str | None:
    if not items:
        return None

    last_item = items[-1]
    return f"{last_item.created_at.isoformat()}|{last_item.deployment_id}"


def _to_list_item(deployment: Deployment) -> DeploymentListItem:
    return DeploymentListItem(
        deployment_id=deployment.deployment_id,
        attributes=deployment.attributes,
        name=deployment.attributes.name,
        description=deployment.attributes.description,
        team=deployment.attributes.team,
        version=deployment.version,
        status=deployment.status,
        type=deployment.type,
        environment=deployment.environment,
        created_at=deployment.created_at,
        created_by=deployment.created_by,
        updated_at=deployment.updated_at,
    )


def find_deployments(
    limit: int,
    cursor: str | None,
    sort_by: SortField,
    sort_order: SortOrder,
    status: DeploymentStatus | None,
    deployment_type: DeploymentType | None,
    environment: DeploymentEnvironment | None,
) -> tuple[list[DeploymentListItem], str | None, int]:
    db_sort_field = SORT_FIELD_MAP[sort_by]
    db_sort_order = SORT_ORDER_MAP[sort_order]
    base_query = {"deleted_at": None}

    if status is not None:
        base_query["status"] = status.value

    if deployment_type is not None:
        base_query["type"] = deployment_type.value

    if environment is not None:
        base_query["environment"] = environment.value

    query = dict(base_query)

    if cursor:
        query.update(_build_cursor_filter(cursor, sort_order))

    documents = list(
        deployments_collection
        .find(query)
        .sort([(db_sort_field, db_sort_order), ("deployment_id", db_sort_order)])
        .limit(limit + 1)
    )

    has_more = len(documents) > limit
    page_documents = documents[:limit]
    deployments = [Deployment.model_validate(document) for document in page_documents]
    items = [_to_list_item(deployment) for deployment in deployments]
    next_cursor = _build_next_cursor(deployments) if has_more else None
    total = deployments_collection.count_documents(base_query)

    return items, next_cursor, total


def find_deployment_by_id(deployment_id: str) -> Deployment | None:
    document = deployments_collection.find_one(
        {"deployment_id": deployment_id, "deleted_at": None}
    )

    if document is None:
        return None

    return Deployment.model_validate(document)


def find_deleted_deployment_by_id(deployment_id: str) -> Deployment | None:
    document = deployments_collection.find_one(
        {"deployment_id": deployment_id, "deleted_at": {"$ne": None}}
    )

    if document is None:
        return None

    return Deployment.model_validate(document)


def update_deployment(
    deployment_id: str,
    update_request: UpdateDeploymentRequest,
) -> DeploymentListItem | None:
    update_fields: dict[str, str | datetime | None] = {"updated_at": datetime.now(timezone.utc)}

    if update_request.name is not None:
        update_fields["attributes.name"] = update_request.name

    if update_request.description is not None:
        update_fields["attributes.description"] = update_request.description

    document = deployments_collection.find_one_and_update(
        {"deployment_id": deployment_id, "deleted_at": None},
        {"$set": update_fields},
        return_document=ReturnDocument.AFTER,
    )

    if document is None:
        return None

    deployment = Deployment.model_validate(document)
    return _to_list_item(deployment)


def update_deployment_attributes(
    deployment_id: str,
    update_request: UpdateDeploymentAttributesRequest,
) -> Deployment | None:
    set_fields = {
        f"attributes.{key}": value
        for key, value in update_request.set.items()
    }
    unset_fields = {
        f"attributes.{key}": ""
        for key in update_request.remove
    }

    update_document: dict[str, dict[str, str | datetime]] = {
        "$set": {"updated_at": datetime.now(timezone.utc)},
    }

    if set_fields:
        update_document["$set"].update(set_fields)

    if unset_fields:
        update_document["$unset"] = unset_fields

    document = deployments_collection.find_one_and_update(
        {"deployment_id": deployment_id, "deleted_at": None},
        update_document,
        return_document=ReturnDocument.AFTER,
    )

    if document is None:
        return None

    return Deployment.model_validate(document)


def delete_deployment(deployment_id: str) -> bool:
    result = deployments_collection.update_one(
        {"deployment_id": deployment_id, "deleted_at": None},
        {
            "$set": {
                "deleted_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    return result.modified_count > 0


def restore_deployment(deployment_id: str) -> Deployment | None:
    document = deployments_collection.find_one_and_update(
        {"deployment_id": deployment_id, "deleted_at": {"$ne": None}},
        {
            "$set": {
                "updated_at": datetime.now(timezone.utc),
                "deleted_at": None,
            },
        },
        return_document=ReturnDocument.AFTER,
    )

    if document is None:
        return None

    return Deployment.model_validate(document)
