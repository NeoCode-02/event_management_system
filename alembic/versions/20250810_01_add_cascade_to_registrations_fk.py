"""Add ON DELETE CASCADE to registrations.event_id FK

Revision ID: add_cascade_regs_fk_20250810_01
Revises: e192d1707a3a
Create Date: 2025-08-10 10:49:00

"""

from collections.abc import Sequence
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "add_cascade_regs_fk_20250810_01"
down_revision: str | Sequence[str] | None = "e192d1707a3a"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Drop existing FK (assumes default naming convention)
    op.drop_constraint("registrations_event_id_fkey", "registrations", type_="foreignkey")
    # Recreate with ON DELETE CASCADE
    op.create_foreign_key(
        "registrations_event_id_fkey",
        "registrations",
        "events",
        ["event_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    # Revert to no cascade
    op.drop_constraint("registrations_event_id_fkey", "registrations", type_="foreignkey")
    op.create_foreign_key(
        "registrations_event_id_fkey",
        "registrations",
        "events",
        ["event_id"],
        ["id"],
    )


