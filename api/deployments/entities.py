from datetime import datetime

from pydantic import BaseModel, Field, model_validator

from deployments.validators import (
    validate_attribute_update_request,
    validate_deployment_update_request,
)


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


class DeploymentListItem(BaseModel):
    deployment_id: str
    attributes: DeploymentAttributes
    name: str
    description: str | None = None
    team: str
    version: str
    status: str
    type: str
    environment: str
    created_at: datetime
    created_by: str
    updated_at: datetime


class UpdateDeploymentRequest(BaseModel):
    name: str | None = None
    description: str | None = None

    @model_validator(mode="after")
    def validate_request(self) -> "UpdateDeploymentRequest":
        validate_deployment_update_request(name=self.name, description=self.description)
        return self


class UpdateDeploymentAttributesRequest(BaseModel):
    set: dict[str, str] = Field(default_factory=dict)
    remove: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_request(self) -> "UpdateDeploymentAttributesRequest":
        validate_attribute_update_request(set_fields=self.set, remove_fields=self.remove)
        return self


class DeploymentListResponse(BaseModel):
    items: list[DeploymentListItem] = Field(default_factory=list)
    total: int
    next_cursor: str | None = None
