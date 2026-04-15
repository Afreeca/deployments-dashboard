from enum import Enum


class SortField(str, Enum):
    created_at = "created_at"
    name = "name"
    status = "status"
    type = "type"
    environment = "environment"
    created_by = "created_by"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class DeploymentStatus(str, Enum):
    active = "active"
    failed = "failed"
    stopped = "stopped"


class DeploymentType(str, Enum):
    web_service = "web_service"
    worker = "worker"
    cron_job = "cron_job"


class DeploymentEnvironment(str, Enum):
    production = "production"
    staging = "staging"
    development = "development"
