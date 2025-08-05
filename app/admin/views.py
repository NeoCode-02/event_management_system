from typing import ClassVar
from starlette_admin.contrib.sqla import ModelView
from app.models.user import User
from app.models.event import Event
from app.models.registration import Registration


class UserAdminView(ModelView):
    fields: ClassVar[list[str]] = [
        "id", "email", "password_hash", "is_active", "is_confirmed", "is_admin", "created_at"
    ]
    exclude_fields_from_create: ClassVar[list[str]] = ["created_at"]
    exclude_fields_from_edit: ClassVar[list[str]] = ["created_at"]
    exclude_fields_from_list: ClassVar[list[str]] = ["created_at"]
    export_fields: ClassVar[list[str]] = fields
    export_types: ClassVar[list[str]] = ["csv", "excel", "pdf", "print"]


class EventAdminView(ModelView):
    fields: ClassVar[list[str]] = [
        "id", "title", "description", "location", "date", "is_public", "organizer", "created_at"
    ]
    exclude_fields_from_create: ClassVar[list[str]] = ["created_at"]
    exclude_fields_from_edit: ClassVar[list[str]] = ["created_at"]
    exclude_fields_from_list: ClassVar[list[str]] = ["created_at"]
    export_fields: ClassVar[list[str]] = fields
    export_types: ClassVar[list[str]] = ["csv", "excel", "pdf", "print"]


class RegistrationAdminView(ModelView):
    fields: ClassVar[list[str]] = [
        "id", "event", "name", "surname", "email", "phone", "status", "created_at"
    ]
    exclude_fields_from_create: ClassVar[list[str]] = ["created_at"]
    exclude_fields_from_edit: ClassVar[list[str]] = ["created_at"]
    exclude_fields_from_list: ClassVar[list[str]] = ["created_at"]
    export_fields: ClassVar[list[str]] = fields
    export_types: ClassVar[list[str]] = ["csv", "excel", "pdf", "print"]
