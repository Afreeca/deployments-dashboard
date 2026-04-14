from deployments.entities import Deployment
from database.collections import deployments_collection


def find_deployments(limit: int = 50) -> list[Deployment]:
    documents = deployments_collection.find({"deleted_at": None}).limit(limit)
    return [Deployment.model_validate(document) for document in documents]
