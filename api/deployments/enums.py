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