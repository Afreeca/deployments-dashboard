from datetime import datetime, timezone

from deployments.entities import Deployment, DeploymentListItem


def build_deployment_dict(**overrides) -> dict:
    deployment = {
        "deployment_id": "dep-001",
        "version": "1.0.0",
        "status": "active",
        "type": "web_service",
        "environment": "production",
        "attributes": {
            "name": "checkout-api",
            "description": "Handles checkout requests",
            "team": "payments",
            "region": "eu-west-1",
            "language": "python",
            "framework": "fastapi",
            "priority": "high",
            "oncall": "payments-oncall",
        },
        "created_at": datetime(2026, 4, 1, 12, 0, tzinfo=timezone.utc),
        "created_by": "adilson",
        "updated_at": datetime(2026, 4, 10, 9, 30, tzinfo=timezone.utc),
        "deleted_at": None,
    }
    deployment.update(overrides)
    return deployment


def build_deployment(**overrides) -> Deployment:
    return Deployment.model_validate(build_deployment_dict(**overrides))


def build_deployment_list_item(**overrides) -> DeploymentListItem:
    deployment = build_deployment(**overrides)
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
