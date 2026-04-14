def validate_deployment_update_request(
    *,
    name: str | None,
    description: str | None,
) -> None:
    if name is None and description is None:
        raise ValueError("At least 'name' or 'description' must be provided.")


def validate_attribute_update_request(
    *,
    set_fields: dict[str, str],
    remove_fields: list[str],
) -> None:
    if not set_fields and not remove_fields:
        raise ValueError("At least one attribute change must be provided.")

    overlapping_keys = set(set_fields).intersection(remove_fields)
    if overlapping_keys:
        joined_keys = ", ".join(sorted(overlapping_keys))
        raise ValueError(
            f"Attribute keys cannot be set and removed in the same request: {joined_keys}."
        )
