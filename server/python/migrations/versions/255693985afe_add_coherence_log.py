"""add coherence_log

Revision ID: 255693985afe
Revises:
Create Date: 2025-04-17 14:28:18.479584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '255693985afe'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    """Upgrade schema."""
    # Create the coherence_logs table with a structure matching the SQLModel
    op.create_table(
        'coherence_logs',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('stability', sa.Float(), nullable=False),
        sa.Column('exploration', sa.Float(), nullable=False),
        sa.Column('ratio', sa.String(), nullable=False),
        sa.Column('source', sa.String(), nullable=False),
        sa.Column('context', sa.String(), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create index on timestamp to speed up queries that sort or filter by timestamp
    op.create_index(
        'ix_coherence_logs_timestamp',
        'coherence_logs',
        ['timestamp'],
        unique=False
    )

    # Create index on source to speed up queries that filter by source
    op.create_index(
        'ix_coherence_logs_source',
        'coherence_logs',
        ['source'],
        unique=False
    )


def downgrade():
    """Downgrade schema."""
    # Drop indexes first
    op.drop_index('ix_coherence_logs_source', 'coherence_logs')
    op.drop_index('ix_coherence_logs_timestamp', 'coherence_logs')

    # Then drop the table
    op.drop_table('coherence_logs')
