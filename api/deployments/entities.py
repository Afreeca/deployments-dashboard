from datetime import datetime

from pydantic import BaseModel, Field


class DeploymentAttributes(BaseModel):
    name: str
    description: str | None = None
    team: str
    region: str | None = None
    language: str | None = None
    framework: str | None = None
    priority: str | None = None
    oncall: str | None = None


class Deployment(BaseModel):
    deployment_id: str
    version: str
    status: str
    type: str
    environment: str
    attributes: DeploymentAttributes
    created_at: datetime
    created_by: str
    updated_at: datetime
    deleted_at: datetime | None = None


class DeploymentListResponse(BaseModel):
    items: list[Deployment] = Field(default_factory=list)
    total: int
    next_cursor: str | None = None
